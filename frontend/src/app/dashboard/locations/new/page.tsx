'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from '@heroui/react';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { useCreateDashboardLocation } from '@/api/bookingApiComponents';
import { useOrganization } from '@/contexts/OrganizationContext';
import type { CreateLocationRequest } from '@/api/bookingApiSchemas';

interface LocationFormData {
  name: string;
  address: string;
  description: string;
  capacity: number;
  openTime: string;
  closeTime: string;
  locationType: string;
}

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

const locationTypes = [
  { value: '0', label: 'None' },
  { value: '1', label: 'Hotel' },
  { value: '2', label: 'B&B' },
];

export default function NewLocationPage() {
  const router = useRouter();
  const { user } = useOrganization();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationFormData>({
    defaultValues: {
      name: '',
      address: '',
      description: '',
      capacity: 1,
      openTime: '09:00:00',
      closeTime: '17:00:00',
      locationType: '1',
    },
  });

  const createLocationMutation = useCreateDashboardLocation({
    onSuccess: () => {
      router.push('/dashboard/locations');
    },
  });

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newImagePromises = files.map(async (file) => {
      // Convert to data URL
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      return {
        file,
        preview: dataUrl,
        id: Math.random().toString(36).substring(7),
      };
    });

    const newImages = await Promise.all(newImagePromises);
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const onSubmit = async (data: LocationFormData) => {
    if (!user?.organizationId) {
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody: CreateLocationRequest = {
        name: data.name,
        address: data.address,
        description: data.description,
        capacity: Number(data.capacity),
        openTime: data.openTime,
        closeTime: data.closeTime,
        locationType: Number(data.locationType),
        images: images.map(img => img.preview), // Send data URLs
      };

      await createLocationMutation.mutateAsync({
        body: requestBody,
        headers: {
          'X-Organization-Id': user.organizationId,
        },
      });
    } catch (error) {
      console.error('Failed to create location:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          isIconOnly
          variant="flat"
          onPress={() => router.back()}
          isDisabled={isSubmitting}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Add New Location
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Create a new location for {user?.organizationName}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card shadow="sm">
          <CardHeader>
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </CardHeader>
          <CardBody className="gap-4">
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Location Name"
                  placeholder="Enter location name"
                  isRequired
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  isDisabled={isSubmitting}
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              rules={{ required: 'Address is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Address"
                  placeholder="Enter full address"
                  isRequired
                  isInvalid={!!errors.address}
                  errorMessage={errors.address?.message}
                  isDisabled={isSubmitting}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Description"
                  placeholder="Enter location description"
                  isRequired
                  isInvalid={!!errors.description}
                  errorMessage={errors.description?.message}
                  isDisabled={isSubmitting}
                  minRows={4}
                />
              )}
            />

            <Controller
              name="locationType"
              control={control}
              rules={{ required: 'Location type is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Location Type"
                  placeholder="Select a type"
                  isRequired
                  isInvalid={!!errors.locationType}
                  errorMessage={errors.locationType?.message}
                  isDisabled={isSubmitting}
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0];
                    field.onChange(value?.toString() || '');
                  }}
                >
                  {locationTypes.map((type) => (
                    <SelectItem key={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </CardBody>
        </Card>

        {/* Capacity & Hours */}
        <Card shadow="sm">
          <CardHeader>
            <h2 className="text-lg font-semibold">Capacity & Operating Hours</h2>
          </CardHeader>
          <CardBody className="gap-4">
            <Controller
              name="capacity"
              control={control}
              rules={{
                required: 'Capacity is required',
                min: { value: 1, message: 'Capacity must be at least 1' },
              }}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Capacity"
                  placeholder="Enter capacity"
                  isRequired
                  isInvalid={!!errors.capacity}
                  errorMessage={errors.capacity?.message}
                  isDisabled={isSubmitting}
                  value={field.value?.toString() || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="openTime"
                control={control}
                rules={{ required: 'Opening time is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="time"
                    label="Opening Time"
                    isRequired
                    isInvalid={!!errors.openTime}
                    errorMessage={errors.openTime?.message}
                    isDisabled={isSubmitting}
                    onChange={(e) => field.onChange(`${e.target.value}:00`)}
                    value={field.value?.substring(0, 5) || ''}
                  />
                )}
              />

              <Controller
                name="closeTime"
                control={control}
                rules={{ required: 'Closing time is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="time"
                    label="Closing Time"
                    isRequired
                    isInvalid={!!errors.closeTime}
                    errorMessage={errors.closeTime?.message}
                    isDisabled={isSubmitting}
                    onChange={(e) => field.onChange(`${e.target.value}:00`)}
                    value={field.value?.substring(0, 5) || ''}
                  />
                )}
              />
            </div>
          </CardBody>
        </Card>

        {/* Images */}
        <Card shadow="sm">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Images</h2>
            <p className="text-sm text-default-500">
              {images.length} image{images.length !== 1 ? 's' : ''} selected
            </p>
          </CardHeader>
          <CardBody className="gap-4">
            {/* Image Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onPress={() => removeImage(image.id)}
                      isDisabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isSubmitting}
              />
              <div className="border-2 border-dashed border-default-300 rounded-lg p-8 hover:border-primary transition-colors text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-default-400" />
                <p className="text-sm font-medium mb-1">
                  Click to upload images
                </p>
                <p className="text-xs text-default-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            </label>

            <p className="text-xs text-default-500">
              Images are stored as data URLs. For production, consider using cloud storage (Azure Blob, S3, etc.).
            </p>
          </CardBody>
        </Card>

        {/* Error Message */}
        {createLocationMutation.isError && (
          <Card shadow="sm" className="bg-danger-50">
            <CardBody>
              <p className="text-sm font-medium text-danger">Failed to create location</p>
              <p className="text-xs mt-1 text-danger">
                {createLocationMutation.error?.payload || 'An unexpected error occurred'}
              </p>
            </CardBody>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="flat"
            onPress={() => router.back()}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            isLoading={isSubmitting}
          >
            Create Location
          </Button>
        </div>
      </form>
    </div>
  );
}
