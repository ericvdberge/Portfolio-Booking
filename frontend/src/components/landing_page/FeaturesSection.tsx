import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, CreditCard, Headphones, Wifi, Coffee, Presentation } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'End-to-end encrypted transactions with full payment protection and secure data handling.',
    badge: 'Security'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Book venues anytime with instant confirmation and real-time availability updates.',
    badge: 'Convenience'
  },
  {
    icon: CreditCard,
    title: 'Flexible Payment',
    description: 'Multiple payment options with transparent pricing and no hidden fees.',
    badge: 'Payment'
  },
  {
    icon: Headphones,
    title: 'Premium Support',
    description: 'Dedicated customer support team available to help with bookings and venue questions.',
    badge: 'Support'
  }
];

const amenities = [
  { icon: Wifi, name: 'High-Speed WiFi' },
  { icon: Coffee, name: 'Refreshments' },
  { icon: Presentation, name: 'AV Equipment' },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Why Choose Our Platform?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Experience seamless venue booking with enterprise-grade features and unmatched convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-20">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.title} className="relative border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <IconComponent className="h-6 w-6 text-purple-600" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Premium Amenities
            </h3>
            <p className="text-slate-600">
              Every venue comes equipped with modern amenities to ensure your event runs smoothly.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {amenities.map((amenity) => {
              const IconComponent = amenity.icon;
              return (
                <div key={amenity.name} className="flex flex-col items-center text-center">
                  <div className="mb-3 rounded-full bg-slate-100 p-4">
                    <IconComponent className="h-6 w-6 text-slate-700" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{amenity.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}