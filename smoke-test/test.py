"""Test file for pyright-action v3 smoke tests."""

from typing import List, Dict, Optional
import time

def slow_function(data: List[Dict[str, str]]) -> Optional[str]:
    """A function that might be slow for testing stats."""
    # Simulate some work
    result = None
    for item in data:
        if "key" in item:
            result = item["key"]
            # Add some complexity to make type checking take time
            for i in range(1000):
                temp = str(i) + result
    return result

def another_function(x: int, y: str) -> bool:
    """Another function with type annotations."""
    return len(y) > x

# Some untyped variables to test type coverage
untyped_var = 42
another_untyped = "hello"

class TestClass:
    """A test class."""
    
    def __init__(self, value: int):
        self.value = value
        self.untyped_attr = None  # This will need typing
    
    def method_with_types(self, param: str) -> int:
        """Method with proper typing."""
        return len(param) + self.value
    
    def untyped_method(self, param):
        """Method without type annotations."""
        return param + self.value

print("Smoke test complete")
