"""
Profiling module for the Startup Platform API.

Provides request timing middleware and profiling utilities.
"""

from profiling.middleware import ProfilingMiddleware
from profiling.router import router as profiling_router

__all__ = ["ProfilingMiddleware", "profiling_router"]
