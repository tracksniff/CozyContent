"""Preview hosting routes — mounted at the root so previews live at
``preview.cosycontent.com/<slug>`` (and ``/p/<slug>`` as a namespaced alias).

The slug pattern excludes ``admin``/``api`` paths implicitly because those are
matched earlier in the root URLConf.
"""

from django.urls import path

from . import views

urlpatterns = [
    path("samples/", views.preview_samples_index, name="preview-samples-index"),
    path("samples/<str:category>/", views.preview_sample, name="preview-sample"),
    path("p/<slug:slug>/", views.preview_detail, name="preview-detail"),
    path("p/<slug:slug>", views.preview_detail),
    path("<slug:slug>/", views.preview_detail, name="preview-detail-root"),
    path("<slug:slug>", views.preview_detail),
]
