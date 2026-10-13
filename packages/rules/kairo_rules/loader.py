"""YAML rule loader and schema validator for KAIRO (TRD Section 7)."""

from pathlib import Path
from typing import List, Dict, Any
import yaml
from kairo_analysis.models import RuleDefinition

RULES_DIR = Path(__file__).parent.parent / "rules"


def load_rule_from_file(rule_path: Path) -> RuleDefinition:
    """Load and validate a single rule file against RuleDefinition schema."""
    raw_content = rule_path.read_text(encoding="utf-8")
    data: Dict[str, Any] = yaml.safe_load(raw_content)
    return RuleDefinition(**data)


def load_all_rules(rules_dir: Path = RULES_DIR) -> List[RuleDefinition]:
    """Load and validate all YAML rules in the rules directory."""
    rules: List[RuleDefinition] = []
    for file_path in sorted(rules_dir.glob("*.yaml")):
        rule = load_rule_from_file(file_path)
        rules.append(rule)
    return rules
