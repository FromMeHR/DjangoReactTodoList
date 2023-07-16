from django.contrib import admin
from .models import Post

# Register your models here.
# admin.site.register(Post)
@admin.register(Post)
class PostVoled(admin.ModelAdmin):
    list_filter = ('title','description','date','completed','username')
    list_display = ('title','description','date','completed','username')