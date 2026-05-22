from rest_framework import serializers

from .models import User, Website, ClientApplication, ApplicationImage, Feedback, Attachment, AuditReport, SiteRequest

class AuditReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditReport
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'report_data', 'meta_title', 'meta_description', 'load_speed_score')

class SiteRequestSerializer(serializers.ModelSerializer):
    website_name = serializers.CharField(source='website.name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = SiteRequest
        fields = ('id', 'website', 'website_name', 'user_email', 'details', 'status', 'rejection_reason', 'is_priority', 'created_at', 'updated_at')
        read_only_fields = ('id', 'status', 'created_at', 'updated_at')

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ('id', 'section_name', 'comment', 'created_at', 'is_resolved')

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ('id', 'file', 'filename', 'category', 'uploaded_at')

class ApplicationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationImage
        fields = ('id', 'image', 'uploaded_at')

class ClientApplicationSerializer(serializers.ModelSerializer):
    images = ApplicationImageSerializer(many=True, read_only=True)
    feedbacks = FeedbackSerializer(many=True, read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False,
    )
    trust_badge_files = serializers.ListField(
        child=serializers.FileField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False,
    )
    testimonial_files = serializers.ListField(
        child=serializers.FileField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False,
    )

    class Meta:
        model = ClientApplication
        fields = (
            'id', 'company_name', 'phone_number', 'website_url', 'industry',
            'tagline', 'services_list', 'city_location', 'years_experience',
            'trust_badges', 'trust_badge_links', 'service_areas',
            'testimonials', 'testimonial_links', 'branding_colors',
            'company_logo', 'status', 'plan_type', 'github_username_for_transfer',
            'progress', 'is_reviewed', 'created_at',
            'images', 'uploaded_images',
            'trust_badge_files', 'testimonial_files',
            'feedbacks', 'attachments',
        )
        read_only_fields = ('id', 'created_at', 'images', 'feedbacks', 'attachments')

    def create(self, validated_data):
        uploaded_images   = validated_data.pop('uploaded_images', [])
        trust_badge_files = validated_data.pop('trust_badge_files', [])
        testimonial_files = validated_data.pop('testimonial_files', [])

        application = ClientApplication.objects.create(**validated_data)

        for image in uploaded_images:
            ApplicationImage.objects.create(application=application, image=image)

        for f in trust_badge_files:
            Attachment.objects.create(
                application=application, file=f, filename=f.name, category='certification',
            )

        for f in testimonial_files:
            Attachment.objects.create(
                application=application, file=f, filename=f.name, category='testimonial',
            )

        return application

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    # Use SerializerMethodField to avoid crash if columns are not yet in DB
    monthly_requests_remaining = serializers.SerializerMethodField()
    purchased_requests_remaining = serializers.SerializerMethodField()
    priority_updates_active = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'email', 'password', 'first_name', 'last_name', 'is_staff', 
            'is_premium', 'plan_type', 'subscription_status', 'monthly_requests_remaining',
            'purchased_requests_remaining', 'priority_updates_active'
        )

    def get_monthly_requests_remaining(self, obj):
        return getattr(obj, 'monthly_requests_remaining', 0)

    def get_purchased_requests_remaining(self, obj):
        return getattr(obj, 'purchased_requests_remaining', 0)

    def get_priority_updates_active(self, obj):
        return getattr(obj, 'priority_updates_active', False)

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'confirm_password', 'first_name', 'last_name')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user

class WebsiteSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    owner_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='owner', 
        required=False
    )

    class Meta:
        model = Website
        fields = ('id', 'name', 'url', 'custom_domain', 'created_at', 'owner_email', 'owner_id', 'hosting_type', 'plan_type', 'dns_ready')
        read_only_fields = ('id', 'created_at', 'owner_email')

    def create(self, validated_data):
        # Default to current user if owner is not provided (usually by staff)
        if 'owner' not in validated_data:
            validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)
