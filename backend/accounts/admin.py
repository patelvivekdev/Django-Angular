from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from accounts.forms import CustomUserCreationForm, CustomUserChangeForm
from accounts.models import CustomUser, ResetPassword, UserToken


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('first_name', 'last_name',
                    'email', 'is_staff', 'is_active',)
    list_filter = ('first_name', 'last_name',
                   'email', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (("Personal info"), {"fields": ("first_name", "last_name")}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
        ('Is Deleted', {'fields': ('is_deleted',)})
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('first_name', 'last_name', 'email', 'password1', 'password2', 'is_staff', 'is_active')}
         ),
    )
    search_fields = ('first_name', 'last_name', 'email',)
    ordering = ('first_name', 'last_name', 'email',)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserToken)
admin.site.register(ResetPassword)
