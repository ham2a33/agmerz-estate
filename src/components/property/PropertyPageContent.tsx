import { Container } from "@/components/layout/Container";
import { PropertyBreadcrumbs } from "@/components/property/PropertyBreadcrumbs";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyInfo } from "@/components/property/PropertyInfo";
import { PropertyKeyCharacteristics } from "@/components/property/PropertyKeyCharacteristics";
import { PropertyDescription } from "@/components/property/PropertyDescription";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { PropertyMap } from "@/components/property/PropertyMap";
import { ViewingRequest } from "@/components/property/ViewingRequest";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { PropertyMobileBar } from "@/components/property/PropertyMobileBar";
import {
  getGalleryImages,
  getSimilarProperties,
} from "@/lib/property-helpers";
import type { Property } from "@/types";
import type { StoreConfig } from "@/lib/store-config.types";

interface PropertyPageContentProps {
  property: Property;
  shareUrl: string;
  config: StoreConfig;
}

export async function PropertyPageContent({ property, shareUrl, config }: PropertyPageContentProps) {
  const images = getGalleryImages(property);
  const similar = await getSimilarProperties(property);

  return (
    <>
      <div className="pb-24 md:pb-0">
        <Container className="py-8 md:py-12">
          <PropertyBreadcrumbs property={property} />

          <PropertyGallery images={images} title={property.title} />

          <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[1fr_400px] lg:gap-16">
            <div className="flex flex-col gap-10 md:gap-12">
              <div className="space-y-6 lg:hidden">
                <PropertyHeader property={property} />
              </div>

              <PropertyKeyCharacteristics property={property} />
              <PropertyDescription description={property.description} />
              <PropertyFeatures features={property.features} />
              <PropertyMap
                coordinates={property.coordinates}
                address={property.address}
                district={property.district}
              />
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <PropertyHeader property={property} />
                <PropertyInfo property={property} shareUrl={shareUrl} config={config} />
                <ViewingRequest propertyId={property.id} propertyTitle={property.title} />
              </div>
            </aside>
          </div>
        </Container>

        <SimilarProperties properties={similar} />
      </div>

      <PropertyMobileBar />
    </>
  );
}
