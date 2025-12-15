"""
Profiling API endpoints.

Provides endpoints to view profiling statistics.
"""

from typing import Dict, List, Any

from fastapi import APIRouter, Query

from profiling.middleware import request_stats

router = APIRouter(prefix="/profiling", tags=["profiling"])


@router.get("/stats")
def get_profiling_stats() -> Dict[str, Any]:
    """
    Get profiling statistics summary.
    
    Returns:
        Summary of request timing statistics per endpoint.
    """
    return {
        "summary": request_stats.get_summary(),
        "total_requests_tracked": len(request_stats.requests)
    }


@router.get("/requests")
def get_recent_requests(
    limit: int = Query(default=50, ge=1, le=500)
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Get recent requests with timing data.
    
    Args:
        limit: Maximum number of requests to return (1-500)
        
    Returns:
        List of recent requests with timing information.
    """
    return {
        "requests": request_stats.get_recent_requests(limit)
    }


@router.get("/endpoints")
def get_endpoint_stats() -> Dict[str, Any]:
    """
    Get detailed statistics per endpoint.
    
    Returns:
        Detailed timing statistics grouped by endpoint.
    """
    summary = request_stats.get_summary()
    
    sorted_by_count = sorted(
        summary.items(),
        key=lambda x: x[1]["count"],
        reverse=True
    )
    
    sorted_by_time = sorted(
        summary.items(),
        key=lambda x: x[1]["avg_time_ms"],
        reverse=True
    )
    
    return {
        "by_request_count": dict(sorted_by_count),
        "by_avg_response_time": dict(sorted_by_time)
    }


@router.post("/clear")
def clear_stats() -> Dict[str, str]:
    """
    Clear all profiling statistics.
    
    Returns:
        Confirmation message.
    """
    request_stats.clear()
    return {"message": "Profiling statistics cleared"}
