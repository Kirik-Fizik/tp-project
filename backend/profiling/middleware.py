"""
Profiling middleware for FastAPI.

Tracks request timing and stores performance metrics.
"""

import time
import cProfile
import pstats
import io
from typing import Callable, Dict, List, Any
from collections import defaultdict
from datetime import datetime

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class RequestStats:
    """Stores request timing statistics."""
    
    def __init__(self, max_history: int = 1000) -> None:
        self.max_history = max_history
        self.requests: List[Dict[str, Any]] = []
        self.endpoint_stats: Dict[str, Dict[str, Any]] = defaultdict(
            lambda: {"count": 0, "total_time": 0.0, "min_time": float("inf"), "max_time": 0.0}
        )
    
    def add_request(
        self,
        method: str,
        path: str,
        duration: float,
        status_code: int
    ) -> None:
        """Record a request's timing data."""
        request_data = {
            "method": method,
            "path": path,
            "duration_ms": round(duration * 1000, 2),
            "status_code": status_code,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.requests.append(request_data)
        if len(self.requests) > self.max_history:
            self.requests.pop(0)
        
        endpoint_key = f"{method} {path}"
        stats = self.endpoint_stats[endpoint_key]
        stats["count"] += 1
        stats["total_time"] += duration
        stats["min_time"] = min(stats["min_time"], duration)
        stats["max_time"] = max(stats["max_time"], duration)
    
    def get_summary(self) -> Dict[str, Any]:
        """Get summary statistics."""
        summary = {}
        for endpoint, stats in self.endpoint_stats.items():
            if stats["count"] > 0:
                summary[endpoint] = {
                    "count": stats["count"],
                    "avg_time_ms": round((stats["total_time"] / stats["count"]) * 1000, 2),
                    "min_time_ms": round(stats["min_time"] * 1000, 2),
                    "max_time_ms": round(stats["max_time"] * 1000, 2),
                    "total_time_ms": round(stats["total_time"] * 1000, 2)
                }
        return summary
    
    def get_recent_requests(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent requests."""
        return self.requests[-limit:]
    
    def clear(self) -> None:
        """Clear all statistics."""
        self.requests.clear()
        self.endpoint_stats.clear()


request_stats = RequestStats()


class ProfilingMiddleware(BaseHTTPMiddleware):
    """Middleware that tracks request timing."""
    
    async def dispatch(
        self,
        request: Request,
        call_next: Callable[[Request], Response]
    ) -> Response:
        """Process request and record timing."""
        start_time = time.perf_counter()
        
        response = await call_next(request)
        
        duration = time.perf_counter() - start_time
        
        request_stats.add_request(
            method=request.method,
            path=request.url.path,
            duration=duration,
            status_code=response.status_code
        )
        
        response.headers["X-Process-Time"] = f"{duration * 1000:.2f}ms"
        
        return response


def profile_function(func: Callable) -> str:
    """
    Profile a function and return statistics as string.
    
    Args:
        func: Function to profile
        
    Returns:
        Profiling statistics as formatted string
    """
    profiler = cProfile.Profile()
    profiler.enable()
    
    try:
        func()
    finally:
        profiler.disable()
    
    stream = io.StringIO()
    stats = pstats.Stats(profiler, stream=stream)
    stats.sort_stats("cumulative")
    stats.print_stats(30)
    
    return stream.getvalue()
