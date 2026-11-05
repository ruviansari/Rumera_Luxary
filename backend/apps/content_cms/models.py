from django.db import models


class OwnerProfile(models.Model):
    display_name = models.CharField(max_length=200, default="Rumera Founder")
    title = models.CharField(max_length=200, default="Founder & Master Perfumer")
    portrait_url = models.TextField(blank=True, help_text="Image URL, relative path, or base64 image data")
    short_bio = models.TextField(
        default="Dedicated to reviving the royal heritage of pure Indian attars with contemporary artisanal craftsmanship.",
        help_text="Short teaser for homepage"
    )
    full_story = models.TextField(
        default="Rumera Luxury Atra was founded with an unyielding reverence for the timeless tradition of Indian perfumery. Sourcing the rarest botanicals, wild-harvested resins, and ancient deg-bhapka distilled agarwood, every bottle is a masterpiece of quiet luxury.",
        help_text="Full editorial story for /owner page"
    )
    brand_vision = models.TextField(
        default="To establish Indian attars and natural extracts as the pinnacle of global luxury perfumery, honoring sustainability, artisanal distillers, and unmatched purity.",
        blank=True
    )
    values = models.TextField(
        default="100% Pure Non-Alcoholic Oils • Ethically Sourced Wild Aquilaria • Hydro-Distilled in Traditional Degs • Aged in Vintage Leather & Teak",
        blank=True
    )
    quote = models.CharField(
        max_length=300,
        default="Fragrance is the invisible architecture of emotion, etched in memories that never fade.",
        blank=True
    )
    instagram_url = models.CharField(max_length=255, blank=True)
    linkedin_url = models.CharField(max_length=255, blank=True)
    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.display_name} - {self.title} ({'Published' if self.is_published else 'Draft'})"


class ContentPage(models.Model):
    slug = models.SlugField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} (/{self.slug})"
