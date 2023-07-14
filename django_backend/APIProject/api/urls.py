from django.urls import path, include
from .views import PostViewSet, UserViewSet, CompleteViewSet
from rest_framework.routers import DefaultRouter
# post_list, post_details, PostList, PostDetails

router = DefaultRouter()
router.register('posts', PostViewSet, basename='posts')
router.register('users', UserViewSet)
router.register('complete', CompleteViewSet, basename='complete')


urlpatterns = [
    path('api/', include(router.urls)),
    # path('posts/', PostList.as_view()),
    # path('posts/<int:id>/', PostDetails.as_view())

    # path('posts/', post_list),
    # path('posts/<int:pk>/', post_details),
]