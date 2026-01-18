import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, Plus, Search, Clock, Calendar, Tag, 
  CheckCircle, ShoppingCart, Info 
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { wellnessPackages, patients } from '@/data/mockData';
import { WellnessPackage, SERVICE_LABELS, ServiceType, MEMBERSHIP_DISCOUNTS, WELLNESS_TAX_RATE, MembershipType } from '@/types';

const serviceColors: Record<ServiceType, string> = {
  wellness_consultation: 'from-blue-500 to-blue-600',
  nutrition: 'from-green-500 to-green-600',
  fitness: 'from-orange-500 to-orange-600',
  detox: 'from-purple-500 to-purple-600',
  stress_management: 'from-pink-500 to-pink-600',
  health_checkup: 'from-teal-500 to-teal-600'
};

export default function PackagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [packagesList, setPackagesList] = useState<WellnessPackage[]>(wellnessPackages);
  const [selectedPackage, setSelectedPackage] = useState<WellnessPackage | null>(null);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [sessionsToBook, setSessionsToBook] = useState(1);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

  const filteredPackages = packagesList.filter(pkg => {
    const matchesSearch = 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceFilter === 'all' || pkg.serviceType === serviceFilter;
    return matchesSearch && matchesService && pkg.isActive;
  });

  const calculatePrice = (pkg: WellnessPackage, membershipType: MembershipType = 'none') => {
    const grossAmount = pkg.sessionPrice * sessionsToBook;
    const packageDiscount = grossAmount * pkg.packageDiscount;
    const afterPackageDiscount = grossAmount - packageDiscount;
    const membershipDiscount = afterPackageDiscount * MEMBERSHIP_DISCOUNTS[membershipType];
    const afterMembershipDiscount = afterPackageDiscount - membershipDiscount;
    const tax = afterMembershipDiscount * WELLNESS_TAX_RATE;
    const finalAmount = afterMembershipDiscount + tax;

    return {
      grossAmount,
      packageDiscount,
      membershipDiscount,
      tax,
      finalAmount
    };
  };

  const handlePurchase = () => {
    if (!selectedPatient || !selectedPackage) {
      toast({
        title: "Missing Information",
        description: "Please select a patient",
        variant: "destructive"
      });
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    const pricing = calculatePrice(selectedPackage, patient?.membershipType || 'none');

    toast({
      title: "Package Purchased Successfully",
      description: `${selectedPackage.name} (${sessionsToBook} sessions) for ${patient?.firstName} ${patient?.lastName}. Total: £${pricing.finalAmount.toFixed(2)}`,
    });

    setIsPurchaseOpen(false);
    setSelectedPackage(null);
    setSelectedPatient('');
    setSessionsToBook(1);
  };

  const getPatientMembership = () => {
    const patient = patients.find(p => p.id === selectedPatient);
    return patient?.membershipType || 'none';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wellness Packages</h1>
            <p className="text-muted-foreground">
              Explore and purchase wellness packages with membership discounts
            </p>
          </div>
          
          {user?.role === 'admin' && (
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Package
            </Button>
          )}
        </div>

        {/* Package Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries(SERVICE_LABELS).map(([key, label]) => {
            const count = packagesList.filter(p => p.serviceType === key && p.isActive).length;
            return (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all hover:shadow-md ${serviceFilter === key ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setServiceFilter(serviceFilter === key ? 'all' : key)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`h-10 w-10 mx-auto rounded-full bg-gradient-to-br ${serviceColors[key as ServiceType]} flex items-center justify-center mb-2`}>
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium truncate">{label}</p>
                  <p className="text-xs text-muted-foreground">{count} package{count !== 1 ? 's' : ''}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Membership Info */}
        <Card className="bg-gradient-to-r from-amber-50 to-purple-50 dark:from-amber-950/20 dark:to-purple-950/20 border-none">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Membership Discounts</h3>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="outline" className="bg-white dark:bg-gray-800">
                    Silver: 5% off
                  </Badge>
                  <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                    Gold: 10% off
                  </Badge>
                  <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    Platinum: 15% off
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  All packages include 8% NHS wellness tax. Package discounts are applied before membership discounts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages Grid */}
        {filteredPackages.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Packages Found</h3>
              <p className="text-muted-foreground">
                No packages match your search criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${serviceColors[pkg.serviceType]}`} />
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {SERVICE_LABELS[pkg.serviceType]}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {(pkg.packageDiscount * 100).toFixed(0)}% off
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground mb-4">{pkg.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{pkg.sessionsIncluded} sessions included</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>£{pkg.sessionPrice} per session</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span>Valid for {pkg.validityDays} days</span>
                      </div>
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold">
                        £{(pkg.sessionPrice * pkg.sessionsIncluded * (1 - pkg.packageDiscount)).toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground line-through">
                        £{(pkg.sessionPrice * pkg.sessionsIncluded).toFixed(0)}
                      </p>
                    </div>
                    <Dialog open={isPurchaseOpen && selectedPackage?.id === pkg.id} onOpenChange={(open) => {
                      setIsPurchaseOpen(open);
                      if (open) {
                        setSelectedPackage(pkg);
                        setSessionsToBook(pkg.sessionsIncluded);
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button className="gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Purchase
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Purchase {pkg.name}</DialogTitle>
                          <DialogDescription>
                            Complete your package purchase with automatic discounts
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Select Patient</Label>
                            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a patient" />
                              </SelectTrigger>
                              <SelectContent>
                                {patients.map(patient => (
                                  <SelectItem key={patient.id} value={patient.id}>
                                    {patient.firstName} {patient.lastName} ({patient.membershipType})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Number of Sessions</Label>
                            <Input 
                              type="number"
                              min={1}
                              max={pkg.sessionsIncluded}
                              value={sessionsToBook}
                              onChange={(e) => setSessionsToBook(parseInt(e.target.value) || 1)}
                            />
                          </div>

                          {selectedPatient && (
                            <Card className="bg-muted">
                              <CardContent className="p-4 space-y-2">
                                <h4 className="font-semibold">Price Breakdown</h4>
                                {(() => {
                                  const pricing = calculatePrice(pkg, getPatientMembership());
                                  return (
                                    <>
                                      <div className="flex justify-between text-sm">
                                        <span>Gross Amount ({sessionsToBook} × £{pkg.sessionPrice})</span>
                                        <span>£{pricing.grossAmount.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between text-sm text-green-600">
                                        <span>Package Discount ({(pkg.packageDiscount * 100).toFixed(0)}%)</span>
                                        <span>-£{pricing.packageDiscount.toFixed(2)}</span>
                                      </div>
                                      {pricing.membershipDiscount > 0 && (
                                        <div className="flex justify-between text-sm text-purple-600">
                                          <span>Membership Discount ({getPatientMembership()})</span>
                                          <span>-£{pricing.membershipDiscount.toFixed(2)}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>NHS Wellness Tax (8%)</span>
                                        <span>+£{pricing.tax.toFixed(2)}</span>
                                      </div>
                                      <Separator />
                                      <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>£{pricing.finalAmount.toFixed(2)}</span>
                                      </div>
                                    </>
                                  );
                                })()}
                              </CardContent>
                            </Card>
                          )}

                          <Button onClick={handlePurchase} className="w-full" disabled={!selectedPatient}>
                            Confirm Purchase
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
