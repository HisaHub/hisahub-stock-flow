import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BottomNav from '@/components/BottomNav';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  phone: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  mpesa_reference?: string;
}

const Wallet: React.FC = () => {
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositPhone, setDepositPhone] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      // Mock balance for now - in production, this would come from Pesahub API
      setBalance(25000);

      // Mock transactions - in production, fetch from database
      setTransactions([
        {
          id: '1',
          type: 'deposit',
          amount: 10000,
          phone: '0722123456',
          status: 'completed',
          created_at: new Date().toISOString(),
          mpesa_reference: 'QKZ1234567'
        },
        {
          id: '2',
          type: 'withdrawal',
          amount: 5000,
          phone: '0722123456',
          status: 'completed',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          mpesa_reference: 'QKZ7654321'
        }
      ]);
    } catch (error) {
      console.error('Error loading wallet:', error);
      toast({ title: "Error", description: "Failed to load wallet data", variant: "destructive" });
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !depositPhone) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    if (depositPhone.length !== 10 || !depositPhone.startsWith('07')) {
      toast({ title: "Error", description: "Please enter a valid M-Pesa number (07XXXXXXXX)", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // TODO: Integrate with Pesahub API for actual M-Pesa STK push
      // For now, show mock success
      toast({ title: "Success", description: "Deposit initiated! Check your phone for M-Pesa prompt" });

      // Mock transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: parseFloat(depositAmount),
        phone: depositPhone,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      setTransactions([newTransaction, ...transactions]);
      setDepositAmount('');
      setDepositPhone('');

      // Simulate completion after 3 seconds
      setTimeout(() => {
        setTransactions(prev =>
          prev.map(t =>
            t.id === newTransaction.id
              ? { ...t, status: 'completed', mpesa_reference: 'QKZ' + Math.random().toString(36).substr(2, 7).toUpperCase() }
              : t
          )
        );
        setBalance(prev => prev + parseFloat(depositAmount));
        toast({ title: "Success", description: "Deposit completed successfully!" });
      }, 3000);

    } catch (error) {
      console.error('Deposit error:', error);
      toast({ title: "Error", description: "Failed to process deposit", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawPhone) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount > balance) {
      toast({ title: "Error", description: "Insufficient balance", variant: "destructive" });
      return;
    }

    if (withdrawPhone.length !== 10 || !withdrawPhone.startsWith('07')) {
      toast({ title: "Error", description: "Please enter a valid M-Pesa number (07XXXXXXXX)", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // TODO: Integrate with Pesahub API for actual M-Pesa withdrawal
      toast({ title: "Success", description: "Withdrawal initiated! Funds will be sent to your M-Pesa" });

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount,
        phone: withdrawPhone,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      setTransactions([newTransaction, ...transactions]);
      setWithdrawAmount('');
      setWithdrawPhone('');

      // Simulate completion
      setTimeout(() => {
        setTransactions(prev =>
          prev.map(t =>
            t.id === newTransaction.id
              ? { ...t, status: 'completed', mpesa_reference: 'QKZ' + Math.random().toString(36).substr(2, 7).toUpperCase() }
              : t
          )
        );
        setBalance(prev => prev - amount);
        toast({ title: "Success", description: "Withdrawal completed successfully!" });
      }, 3000);

    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({ title: "Error", description: "Failed to process withdrawal", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [1000, 5000, 10000, 20000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-background pb-20">
      <div className="max-w-2xl mx-auto p-4 pt-6">
        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-to-br from-accent to-accent/80 text-white border-none shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <WalletIcon className="w-5 h-5" />
              <CardTitle className="text-white">Wallet Balance</CardTitle>
            </div>
            <CardDescription className="text-white/80">Available funds for trading</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4">KES {balance.toLocaleString()}</p>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1">
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button variant="secondary" className="flex-1">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Tabs */}
        <Tabs defaultValue="deposit" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Deposit Tab */}
          <TabsContent value="deposit">
            <Card>
              <CardHeader>
                <CardTitle>Deposit via M-Pesa</CardTitle>
                <CardDescription>Add funds to your HisaHub wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deposit-phone">M-Pesa Number</Label>
                  <Input
                    id="deposit-phone"
                    placeholder="07XXXXXXXX"
                    value={depositPhone}
                    onChange={(e) => setDepositPhone(e.target.value)}
                    maxLength={10}
                  />
                </div>

                <div>
                  <Label htmlFor="deposit-amount">Amount (KES)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min="100"
                  />
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Quick amounts</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setDepositAmount(amount.toString())}
                      >
                        {amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleDeposit} 
                  disabled={loading} 
                  className="w-full"
                >
                  {loading ? 'Processing...' : 'Deposit Now'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  You will receive an M-Pesa prompt on your phone to confirm the payment
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw">
            <Card>
              <CardHeader>
                <CardTitle>Withdraw to M-Pesa</CardTitle>
                <CardDescription>Transfer funds from your wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-2xl font-bold">KES {balance.toLocaleString()}</p>
                </div>

                <div>
                  <Label htmlFor="withdraw-phone">M-Pesa Number</Label>
                  <Input
                    id="withdraw-phone"
                    placeholder="07XXXXXXXX"
                    value={withdrawPhone}
                    onChange={(e) => setWithdrawPhone(e.target.value)}
                    maxLength={10}
                  />
                </div>

                <div>
                  <Label htmlFor="withdraw-amount">Amount (KES)</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="100"
                    max={balance}
                  />
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Quick amounts</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.filter(a => a <= balance).map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setWithdrawAmount(amount.toString())}
                      >
                        {amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleWithdraw} 
                  disabled={loading} 
                  className="w-full"
                  variant="secondary"
                >
                  {loading ? 'Processing...' : 'Withdraw Now'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Funds will be sent to your M-Pesa number within 5 minutes
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent deposits and withdrawals</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No transactions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === 'deposit' ? 'bg-green-500/20' : 'bg-red-500/20'
                            }`}>
                              {tx.type === 'deposit' ? (
                                <ArrowDownLeft className="w-5 h-5 text-green-500" />
                              ) : (
                                <ArrowUpRight className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold capitalize">{tx.type}</p>
                              <p className="text-xs text-muted-foreground">{tx.phone}</p>
                              {tx.mpesa_reference && (
                                <p className="text-xs text-muted-foreground">Ref: {tx.mpesa_reference}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                              {tx.type === 'deposit' ? '+' : '-'}KES {tx.amount.toLocaleString()}
                            </p>
                            <Badge variant={
                              tx.status === 'completed' ? 'default' :
                              tx.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Wallet;
