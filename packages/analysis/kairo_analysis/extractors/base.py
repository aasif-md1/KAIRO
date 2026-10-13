"""Base extractor interface."""

from abc import ABC, abstractmethod
from pathlib import Path
from typing import List
from kairo_analysis.models import RouteInventoryRecord
from kairo_analysis.parser import MultiLanguageParser


class BaseRouteExtractor(ABC):
    """Abstract base class for framework route extractors."""

    def __init__(self, parser: MultiLanguageParser):
        self.parser = parser

    @abstractmethod
    def extract_routes(self, project_root: Path) -> List[RouteInventoryRecord]:
        """Extract all routes from the project directory."""
        pass
