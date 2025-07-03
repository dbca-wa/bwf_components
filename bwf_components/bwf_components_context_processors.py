"""Context processors for the Django project."""


# Third-Party
from django import conf
from django import http
from django.core.cache import cache

# Typing
from typing import Any

from spatial_layer_monitor import settings


def variables(request: http.HttpRequest) -> dict[str, Any]:
    """Constructs a context dictionary to be passed to the templates.

    Args:
        request (http.HttpRequest): HTTP request object.

    Returns:
        dict[str, Any]: Context for the templates.
    """
    # Construct and return context  


    BWF_FORMS_USE_DEV = conf.settings.BWF_FORMS_USE_DEV if hasattr(conf.settings, 'BWF_FORMS_USE_DEV') else False
    BWF_FORMS_DEV_URL = conf.settings.BWF_FORMS_DEV_URL if hasattr(conf.settings, 'BWF_FORMS_DEV_URL') else ''
    
    return {
        "template_group": "dbcablack",
        "template_title": "",
        "app_build_url": conf.settings.DEV_APP_BUILD_URL,
        "GIT_COMMIT_HASH": conf.settings.GIT_COMMIT_HASH,
        "DJANGO_SETTINGS": conf.settings,
        "settings": conf.settings,
        "BWF_FORMS_USE_DEV": BWF_FORMS_USE_DEV,
        "BWF_FORMS_DEV_URL": BWF_FORMS_DEV_URL,
    }
