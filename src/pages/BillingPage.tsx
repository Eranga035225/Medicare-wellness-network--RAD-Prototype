import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  CreditCard, Plus, Search, Filter, FileText, Download, 
  CheckCircle, Clock, XCircle, Receipt, TrendingUp, DollarSign 
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { bills, patients, wellnessPackages } from '@/data/mockData';
import { Bill, PaymentStatus, WELLNESS_TAX_RATE } from '@/types';

const statusConfig: Record<PaymentStatus, { color: string; icon: React.ReactNode }> = {
  paid: { 
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: <CheckCircle className="h-4 w-4" />
  },
  pending: { 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: <Clock className="h-4 w-4" />
  },
  void: { 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    icon: <XCircle className="h-4 w-4" />
  },
  refunded: { 
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: <XCircle className="h-4 w-4" />
  }
};

export default function BillingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [billsList, setBillsList] = useState<Bill[]>(bills);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const filteredBills = billsList.filter(bill => {
    const patient = bill.patient;
    const matchesSearch = 
      patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const totalRevenue = billsList
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.finalAmount, 0);
  
  const pendingAmount = billsList
    .filter(b => b.paymentStatus === 'pending')
    .reduce((sum, b) => sum + b.finalAmount, 0);

  const totalTaxCollected = billsList
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.taxAmount, 0);

  const handleMarkPaid = (billId: string) => {
    setBillsList(prev => 
      prev.map(bill => bill.id === billId ? { ...bill, paymentStatus: 'paid' as const } : bill)
    );
    toast({
      title: "Payment Recorded",
      description: "The bill has been marked as paid.",
    });
  };

  const handleVoid = (billId: string) => {
    setBillsList(prev => 
      prev.map(bill => bill.id === billId ? { ...bill, paymentStatus: 'void' as const } : bill)
    );
    toast({
      title: "Bill Voided",
      description: "The bill has been voided.",
    });
  };

  // Income by package report
  const incomeByPackage = wellnessPackages.map(pkg => {
    const pkgBills = billsList.filter(b => b.packageId === pkg.id && b.paymentStatus === 'paid');
    return {
      package: pkg,
      totalIncome: pkgBills.reduce((sum, b) => sum + b.finalAmount, 0),
      count: pkgBills.length
    };
  }).filter(p => p.count > 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
            <p className="text-muted-foreground">
              Manage invoices and track payments with 8% NHS wellness tax
            </p>
          </div>
          
          {user?.role !== 'patient' && (
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Invoice
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">LKR{totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">LKR{pendingAmount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">LKR{totalTaxCollected.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Tax Collected (8%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{billsList.length}</p>
                  <p className="text-sm text-muted-foreground">Total Invoices</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient or invoice ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="void">Void</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bills Table */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBills.length === 0 ? (
              <div className="py-10 text-center">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Invoices Found</h3>
                <p className="text-muted-foreground">
                  No invoices match your search criteria
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Gross</TableHead>
                    <TableHead>Discounts</TableHead>
                    <TableHead>Tax (8%)</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill, index) => (
                    <motion.tr
                      key={bill.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b"
                    >
                      <TableCell className="font-mono text-sm">{bill.id}</TableCell>
                      <TableCell>
                        {bill.patient?.firstName} {bill.patient?.lastName}
                      </TableCell>
                      <TableCell>{bill.billDate}</TableCell>
                      <TableCell>{bill.sessionsBooked}</TableCell>
                      <TableCell>LKR{bill.grossAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-green-600">
                        -{((bill.packageDiscountRate + bill.membershipDiscountRate) * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell>LKR{bill.taxAmount.toFixed(2)}</TableCell>
                      <TableCell className="font-bold">LKR{bill.finalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={`gap-1 ${statusConfig[bill.paymentStatus].color}`}>
                          {statusConfig[bill.paymentStatus].icon}
                          {bill.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedBill(bill)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Invoice Details</DialogTitle>
                              </DialogHeader>
                              {selectedBill && (
                                <div className="space-y-4 pt-4">
                                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Invoice ID</p>
                                      <p className="font-mono font-bold">{selectedBill.id}</p>
                                    </div>
                                    <Badge className={statusConfig[selectedBill.paymentStatus].color}>
                                      {selectedBill.paymentStatus}
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-muted-foreground">Patient</Label>
                                      <p className="font-medium">
                                        {selectedBill.patient?.firstName} {selectedBill.patient?.lastName}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Date</Label>
                                      <p className="font-medium">{selectedBill.billDate}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Package</Label>
                                      <p className="font-medium">
                                        {selectedBill.package?.name || 'Single Session'}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Sessions</Label>
                                      <p className="font-medium">{selectedBill.sessionsBooked}</p>
                                    </div>
                                  </div>

                                  <Separator />

                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span>Gross Amount</span>
                                      <span>LKR{selectedBill.grossAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                      <span>Package Discount ({(selectedBill.packageDiscountRate * 100).toFixed(0)}%)</span>
                                      <span>-LKR{(selectedBill.grossAmount * selectedBill.packageDiscountRate).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-purple-600">
                                      <span>Membership Discount ({(selectedBill.membershipDiscountRate * 100).toFixed(0)}%)</span>
                                      <span>-LKR{(selectedBill.grossAmount * selectedBill.membershipDiscountRate).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>NHS Wellness Tax (8%)</span>
                                      <span>+LKR{selectedBill.taxAmount.toFixed(2)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                      <span>Total</span>
                                      <span>LKR{selectedBill.finalAmount.toFixed(2)}</span>
                                    </div>
                                  </div>

                                  {selectedBill.paymentStatus === 'pending' && user?.role !== 'patient' && (
                                    <div className="flex gap-2">
                                      <Button 
                                        onClick={() => handleMarkPaid(selectedBill.id)} 
                                        className="flex-1"
                                      >
                                        Mark as Paid
                                      </Button>
                                      <Button 
                                        variant="destructive"
                                        onClick={() => handleVoid(selectedBill.id)}
                                      >
                                        Void
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          {bill.paymentStatus === 'pending' && user?.role !== 'patient' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleMarkPaid(bill.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Income by Package Report */}
        {user?.role === 'admin' && incomeByPackage.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Income by Package</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {incomeByPackage.map(({ package: pkg, totalIncome, count }) => (
                  <Card key={pkg.id} className="bg-muted/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold">{pkg.name}</h4>
                      <p className="text-2xl font-bold text-primary mt-2">
                        LKR{totalIncome.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {count} purchase{count !== 1 ? 's' : ''}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
