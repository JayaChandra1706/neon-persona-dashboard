
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import DashboardCard from '@/components/DashboardCard';
import LineChart from '@/components/charts/LineChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const FinancePage = () => {
  const { 
    state, 
    addFinanceEntry, 
    updateFinanceEntry, 
    deleteFinanceEntry,
    addAsset,
    updateAsset,
    deleteAsset,
    addLiability,
    updateLiability,
    deleteLiability,
    getNetWorth,
    getNetWorthHistory
  } = useAppContext();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'transaction' | 'asset' | 'liability'>('transaction');
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [transactionForm, setTransactionForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    type: 'income',
    category: '',
    description: ''
  });
  
  const [assetForm, setAssetForm] = useState({
    name: '',
    value: '',
    type: 'cash'
  });
  
  const [liabilityForm, setLiabilityForm] = useState({
    name: '',
    value: '',
    interestRate: ''
  });
  
  // Calculate totals
  const totalIncome = state.finances.entries
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);
  
  const totalExpenses = state.finances.entries
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);
  
  const totalAssets = state.finances.assets
    .reduce((sum, asset) => sum + asset.value, 0);
  
  const totalLiabilities = state.finances.liabilities
    .reduce((sum, liability) => sum + liability.value, 0);
  
  const netWorth = getNetWorth();
  const netWorthHistory = getNetWorthHistory();
  
  // Handle transaction dialog open
  const handleNewTransaction = () => {
    setDialogType('transaction');
    setEditingItem(null);
    setTransactionForm({
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      type: 'income',
      category: '',
      description: ''
    });
    setDialogOpen(true);
  };
  
  // Handle asset dialog open
  const handleNewAsset = () => {
    setDialogType('asset');
    setEditingItem(null);
    setAssetForm({
      name: '',
      value: '',
      type: 'cash'
    });
    setDialogOpen(true);
  };
  
  // Handle liability dialog open
  const handleNewLiability = () => {
    setDialogType('liability');
    setEditingItem(null);
    setLiabilityForm({
      name: '',
      value: '',
      interestRate: ''
    });
    setDialogOpen(true);
  };
  
  // Handle edit transaction
  const handleEditTransaction = (transaction: any) => {
    setDialogType('transaction');
    setEditingItem(transaction);
    setTransactionForm({
      date: transaction.date,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      description: transaction.description
    });
    setDialogOpen(true);
  };
  
  // Handle edit asset
  const handleEditAsset = (asset: any) => {
    setDialogType('asset');
    setEditingItem(asset);
    setAssetForm({
      name: asset.name,
      value: asset.value.toString(),
      type: asset.type
    });
    setDialogOpen(true);
  };
  
  // Handle edit liability
  const handleEditLiability = (liability: any) => {
    setDialogType('liability');
    setEditingItem(liability);
    setLiabilityForm({
      name: liability.name,
      value: liability.value.toString(),
      interestRate: liability.interestRate ? liability.interestRate.toString() : ''
    });
    setDialogOpen(true);
  };
  
  // Handle transaction form changes
  const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransactionForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle asset form changes
  const handleAssetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAssetForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle liability form changes
  const handleLiabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLiabilityForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle transaction form submit
  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const transactionData = {
        date: transactionForm.date,
        amount: parseFloat(transactionForm.amount),
        type: transactionForm.type as 'income' | 'expense',
        category: transactionForm.category,
        description: transactionForm.description
      };
      
      if (editingItem) {
        updateFinanceEntry({
          ...editingItem,
          ...transactionData
        });
        toast.success("Transaction updated");
      } else {
        addFinanceEntry(transactionData);
        toast.success("Transaction added");
      }
      
      setDialogOpen(false);
    } catch (error) {
      toast.error("Error saving transaction");
      console.error(error);
    }
  };
  
  // Handle asset form submit
  const handleAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const assetData = {
        name: assetForm.name,
        value: parseFloat(assetForm.value),
        type: assetForm.type as 'cash' | 'investment' | 'property' | 'other'
      };
      
      if (editingItem) {
        updateAsset({
          ...editingItem,
          ...assetData
        });
        toast.success("Asset updated");
      } else {
        addAsset(assetData);
        toast.success("Asset added");
      }
      
      setDialogOpen(false);
    } catch (error) {
      toast.error("Error saving asset");
      console.error(error);
    }
  };
  
  // Handle liability form submit
  const handleLiabilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const liabilityData = {
        name: liabilityForm.name,
        value: parseFloat(liabilityForm.value),
        interestRate: liabilityForm.interestRate ? parseFloat(liabilityForm.interestRate) : undefined
      };
      
      if (editingItem) {
        updateLiability({
          ...editingItem,
          ...liabilityData
        });
        toast.success("Liability updated");
      } else {
        addLiability(liabilityData);
        toast.success("Liability added");
      }
      
      setDialogOpen(false);
    } catch (error) {
      toast.error("Error saving liability");
      console.error(error);
    }
  };
  
  // Handle delete transaction
  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteFinanceEntry(id);
      toast.success("Transaction deleted");
    }
  };
  
  // Handle delete asset
  const handleDeleteAsset = (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      deleteAsset(id);
      toast.success("Asset deleted");
    }
  };
  
  // Handle delete liability
  const handleDeleteLiability = (id: string) => {
    if (window.confirm('Are you sure you want to delete this liability?')) {
      deleteLiability(id);
      toast.success("Liability deleted");
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold neon-text-magenta mb-6">Finance</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Net Worth" variant="magenta">
          <div className="text-2xl font-bold">
            {formatCurrency(netWorth)}
          </div>
          <div className="text-sm text-muted-foreground">
            Assets - Liabilities
          </div>
        </DashboardCard>
        
        <DashboardCard title="Income" variant="cyan">
          <div className="text-2xl font-bold text-green-400">
            {formatCurrency(totalIncome)}
          </div>
          <div className="text-sm text-muted-foreground">
            Total Income
          </div>
        </DashboardCard>
        
        <DashboardCard title="Expenses" variant="cyan">
          <div className="text-2xl font-bold text-red-400">
            {formatCurrency(totalExpenses)}
          </div>
          <div className="text-sm text-muted-foreground">
            Total Expenses
          </div>
        </DashboardCard>
        
        <DashboardCard title="Balance" variant="cyan">
          <div className="text-2xl font-bold">
            {formatCurrency(totalIncome - totalExpenses)}
          </div>
          <div className="text-sm text-muted-foreground">
            Income - Expenses
          </div>
        </DashboardCard>
      </div>
      
      {/* Net Worth Chart */}
      <DashboardCard title="Net Worth over Time" variant="magenta">
        <LineChart 
          data={netWorthHistory} 
          color="#FF00FF" 
          formatYAxis={(value) => `$${value / 1000}k`}
          formatTooltip={(value) => formatCurrency(value)}
        />
      </DashboardCard>
      
      {/* Tabs for Transactions, Assets, Liabilities */}
      <Tabs defaultValue="transactions">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
        </TabsList>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Transactions</h2>
            <Button onClick={handleNewTransaction} className="bg-magenta hover:bg-magenta/80 text-navy">
              <Plus size={18} className="mr-1" /> Add Transaction
            </Button>
          </div>
          
          <div className="rounded-lg overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Description</th>
                    <th className="text-right p-3">Amount</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.finances.entries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-4 text-muted-foreground">
                        No transactions yet
                      </td>
                    </tr>
                  ) : (
                    state.finances.entries.map(entry => (
                      <tr key={entry.id} className="border-t border-border hover:bg-muted/50">
                        <td className="p-3">{format(new Date(entry.date), 'MMM dd, yyyy')}</td>
                        <td className="p-3">
                          <div className="flex items-center">
                            {entry.type === 'income' ? (
                              <TrendingUp size={16} className="text-green-400 mr-2" />
                            ) : (
                              <TrendingDown size={16} className="text-red-400 mr-2" />
                            )}
                            {entry.type}
                          </div>
                        </td>
                        <td className="p-3">{entry.category}</td>
                        <td className="p-3">{entry.description}</td>
                        <td className={`p-3 text-right ${entry.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(entry.amount)}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditTransaction(entry)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTransaction(entry.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        {/* Assets Tab */}
        <TabsContent value="assets">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Assets</h2>
            <Button onClick={handleNewAsset} className="bg-magenta hover:bg-magenta/80 text-navy">
              <Plus size={18} className="mr-1" /> Add Asset
            </Button>
          </div>
          
          <div className="rounded-lg overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-right p-3">Value</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.finances.assets.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center p-4 text-muted-foreground">
                        No assets yet
                      </td>
                    </tr>
                  ) : (
                    state.finances.assets.map(asset => (
                      <tr key={asset.id} className="border-t border-border hover:bg-muted/50">
                        <td className="p-3">{asset.name}</td>
                        <td className="p-3">{asset.type}</td>
                        <td className="p-3 text-right">{formatCurrency(asset.value)}</td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditAsset(asset)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAsset(asset.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  {state.finances.assets.length > 0 && (
                    <tr className="border-t border-border bg-muted/30">
                      <td colSpan={2} className="p-3 font-medium">Total Assets</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(totalAssets)}</td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        {/* Liabilities Tab */}
        <TabsContent value="liabilities">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Liabilities</h2>
            <Button onClick={handleNewLiability} className="bg-magenta hover:bg-magenta/80 text-navy">
              <Plus size={18} className="mr-1" /> Add Liability
            </Button>
          </div>
          
          <div className="rounded-lg overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3">Name</th>
                    <th className="text-right p-3">Value</th>
                    <th className="text-right p-3">Interest Rate</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.finances.liabilities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center p-4 text-muted-foreground">
                        No liabilities yet
                      </td>
                    </tr>
                  ) : (
                    state.finances.liabilities.map(liability => (
                      <tr key={liability.id} className="border-t border-border hover:bg-muted/50">
                        <td className="p-3">{liability.name}</td>
                        <td className="p-3 text-right">{formatCurrency(liability.value)}</td>
                        <td className="p-3 text-right">
                          {liability.interestRate ? `${liability.interestRate}%` : 'N/A'}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditLiability(liability)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteLiability(liability.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  {state.finances.liabilities.length > 0 && (
                    <tr className="border-t border-border bg-muted/30">
                      <td className="p-3 font-medium">Total Liabilities</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(totalLiabilities)}</td>
                      <td colSpan={2}></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem 
                ? `Edit ${dialogType === 'transaction' ? 'Transaction' : dialogType === 'asset' ? 'Asset' : 'Liability'}`
                : `Add ${dialogType === 'transaction' ? 'Transaction' : dialogType === 'asset' ? 'Asset' : 'Liability'}`}
            </DialogTitle>
          </DialogHeader>
          
          {/* Transaction Form */}
          {dialogType === 'transaction' && (
            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">Date</label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={transactionForm.date}
                  onChange={handleTransactionChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">Type</label>
                <Select
                  value={transactionForm.type}
                  onValueChange={(value) => setTransactionForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">Amount</label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={transactionForm.amount}
                  onChange={handleTransactionChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Input
                  id="category"
                  name="category"
                  value={transactionForm.category}
                  onChange={handleTransactionChange}
                  placeholder="e.g., Salary, Groceries"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input
                  id="description"
                  name="description"
                  value={transactionForm.description}
                  onChange={handleTransactionChange}
                  placeholder="Transaction description"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-magenta text-navy hover:bg-magenta/80">
                  {editingItem ? 'Update' : 'Add'} Transaction
                </Button>
              </div>
            </form>
          )}
          
          {/* Asset Form */}
          {dialogType === 'asset' && (
            <form onSubmit={handleAssetSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  name="name"
                  value={assetForm.name}
                  onChange={handleAssetChange}
                  placeholder="e.g., Savings Account, Investment Portfolio"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">Type</label>
                <Select
                  value={assetForm.type}
                  onValueChange={(value) => setAssetForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="value" className="text-sm font-medium">Value</label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={assetForm.value}
                  onChange={handleAssetChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-magenta text-navy hover:bg-magenta/80">
                  {editingItem ? 'Update' : 'Add'} Asset
                </Button>
              </div>
            </form>
          )}
          
          {/* Liability Form */}
          {dialogType === 'liability' && (
            <form onSubmit={handleLiabilitySubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  name="name"
                  value={liabilityForm.name}
                  onChange={handleLiabilityChange}
                  placeholder="e.g., Credit Card, Student Loan"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="value" className="text-sm font-medium">Value</label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={liabilityForm.value}
                  onChange={handleLiabilityChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="interestRate" className="text-sm font-medium">Interest Rate (%)</label>
                <Input
                  id="interestRate"
                  name="interestRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={liabilityForm.interestRate}
                  onChange={handleLiabilityChange}
                  placeholder="e.g., 4.5"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-magenta text-navy hover:bg-magenta/80">
                  {editingItem ? 'Update' : 'Add'} Liability
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePage;
