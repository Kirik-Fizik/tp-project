"""
Sphinx configuration file for tp-project documentation.
"""

import os
import sys
sys.path.insert(0, os.path.abspath('..'))

project = 'tp-project'
copyright = '2025, Kirik-Borisik-Alexik'
author = 'Kirik-Borisik-Alexik'
release = '1.0.0'

extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
    'sphinx.ext.viewcode',
    'sphinx.ext.intersphinx',
    'sphinx_autodoc_typehints',
]

autodoc_mock_imports = [
    'fastapi',
    'pydantic',
    'sqlalchemy',
    'passlib',
    'jose',
    'dotenv',
    'argon2',
    'email_validator',
]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

html_theme = 'alabaster'
html_static_path = ['_static']

autodoc_member_order = 'bysource'
autodoc_typehints = 'description'
add_module_names = False

intersphinx_mapping = {
    'python': ('https://docs.python.org/3', None),
    'fastapi': ('https://fastapi.tiangolo.com', None),
}
