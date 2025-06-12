import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface OrderPanelProps {
  stock: Stock;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ stock }) => {
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");

  // Default broker for now (can be updated when broker login is implemented)
  const defaultBroker = { id: "genghis", name: "Genghis Capital", fee: "0.25%" };

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    const price = orderType === "market" ? stock.price : parseFloat(limitPrice) || stock.price;
    const total = qty * price;
    const brokerFee = total * 0.0025; // 0.25% fee
    return {
      subtotal: total,
      fee: brokerFee,
      total: total + brokerFee
    };
  };

  const handlePlaceOrder = () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    
    if (orderType === "limit" && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast.error("Please enter a valid limit price");
      return;
    }

    if (orderType === "stop" && (!stopPrice || parseFloat(stopPrice) <= 0)) {
      toast.error("Please enter a valid stop price");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmOrder = () => {
    const { total } = calculateTotal();
    toast.success(`${orderSide.toUpperCase()} order placed for ${quantity} shares of ${stock.symbol} via ${defaultBroker.name} - Total: KES ${total.toFixed(2)}`);
    setShowConfirmation(false);
    setQuantity("");
    setLimitPrice("");
    setStopPrice("");
  };

  const { subtotal, fee, total } = calculateTotal();

  return (
    <div className="glass-card animate-fade-in">
      <Tabs value={orderSide} onValueChange={(value) => setOrderSide(value as "buy" | "sell")}>
        <TabsList className="grid w-full grid-cols-2 bg-white/10">
          <TabsTrigger value="buy" className="text-green-400 data-[state=active]:bg-green-500/20">
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="text-red-400 data-[state=active]:bg-red-500/20">
            Sell
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-4 mt-4">
          <OrderForm 
            orderType={orderType}
            setOrderType={setOrderType}
            quantity={quantity}
            setQuantity={setQuantity}
            limitPrice={limitPrice}
            setLimitPrice={setLimitPrice}
            stopPrice={stopPrice}
            setStopPrice={setStopPrice}
            stock={stock}
            subtotal={subtotal}
            fee={fee}
            total={total}
            onPlaceOrder={handlePlaceOrder}
            orderSide="buy"
            currentBroker={defaultBroker}
          />
        </TabsContent>

        <TabsContent value="sell" className="space-y-4 mt-4">
          <OrderForm 
            orderType={orderType}
            setOrderType={setOrderType}
            quantity={quantity}
            setQuantity={setQuantity}
            limitPrice={limitPrice}
            setLimitPrice={setLimitPrice}
            stopPrice={stopPrice}
            setStopPrice={setStopPrice}
            stock={stock}
            subtotal={subtotal}
            fee={fee}
            total={total}
            onPlaceOrder={handlePlaceOrder}
            orderSide="sell"
            currentBroker={defaultBroker}
          />
        </TabsContent>
      </Tabs>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-primary border-secondary/20">
          <DialogHeader>
            <DialogTitle className="text-off-white">Confirm Order</DialogTitle>
            <DialogDescription className="text-off-white/60">
              Please review your order details before confirmation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <div className="flex justify-between">
              <span className="text-off-white/60">Action:</span>
              <span className={`font-semibold ${orderSide === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                {orderSide.toUpperCase()} {stock.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-off-white/60">Quantity:</span>
              <span className="text-off-white">{quantity} shares</span>
            </div>
            <div className="flex justify-between">
              <span className="text-off-white/60">Order Type:</span>
              <span className="text-off-white capitalize">{orderType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-off-white/60">Price:</span>
              <span className="text-off-white">
                KES {orderType === "market" ? stock.price.toFixed(2) : limitPrice}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-off-white/60">Broker:</span>
              <span className="text-off-white">{defaultBroker.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-off-white/60">Broker Fee:</span>
              <span className="text-off-white">KES {fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-secondary/20 pt-2">
              <span className="text-off-white">Total:</span>
              <span className="text-secondary">KES {total.toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmOrder}
              className={orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              Confirm {orderSide}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface OrderFormProps {
  orderType: string;
  setOrderType: (type: string) => void;
  quantity: string;
  setQuantity: (qty: string) => void;
  limitPrice: string;
  setLimitPrice: (price: string) => void;
  stopPrice: string;
  setStopPrice: (price: string) => void;
  stock: Stock;
  subtotal: number;
  fee: number;
  total: number;
  onPlaceOrder: () => void;
  orderSide: "buy" | "sell";
  currentBroker?: { id: string; name: string; fee: string };
}

const OrderForm: React.FC<OrderFormProps> = ({
  orderType, setOrderType, quantity, setQuantity, limitPrice, setLimitPrice,
  stopPrice, setStopPrice, stock, subtotal, fee, total, onPlaceOrder, 
  orderSide, currentBroker
}) => (
  <>
    {/* Order Type Selection */}
    <div className="space-y-2">
      <Label className="text-off-white">Order Type</Label>
      <Select value={orderType} onValueChange={setOrderType}>
        <SelectTrigger className="bg-white/10 border-secondary/20 text-off-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-primary border-secondary/20">
          <SelectItem value="market">Market Order</SelectItem>
          <SelectItem value="limit">Limit Order</SelectItem>
          <SelectItem value="stop">Stop Order</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Quantity Input */}
    <div className="space-y-2">
      <Label className="text-off-white">Quantity</Label>
      <Input
        type="number"
        placeholder="Enter shares"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="bg-white/10 border-secondary/20 text-off-white placeholder:text-off-white/50"
      />
    </div>

    {/* Conditional Price Inputs */}
    {orderType === "limit" && (
      <div className="space-y-2">
        <Label className="text-off-white">Limit Price</Label>
        <Input
          type="number"
          step="0.01"
          placeholder={`Current: KES ${stock.price}`}
          value={limitPrice}
          onChange={(e) => setLimitPrice(e.target.value)}
          className="bg-white/10 border-secondary/20 text-off-white placeholder:text-off-white/50"
        />
      </div>
    )}

    {orderType === "stop" && (
      <div className="space-y-2">
        <Label className="text-off-white">Stop Price</Label>
        <Input
          type="number"
          step="0.01"
          placeholder={`Current: KES ${stock.price}`}
          value={stopPrice}
          onChange={(e) => setStopPrice(e.target.value)}
          className="bg-white/10 border-secondary/20 text-off-white placeholder:text-off-white/50"
        />
      </div>
    )}

    {/* Selected Broker Display */}
    <div className="bg-white/5 rounded-lg p-3">
      <div className="flex justify-between items-center">
        <span className="text-off-white/60 text-sm">Selected Broker:</span>
        <div className="text-right">
          <span className="text-off-white font-medium">{currentBroker?.name}</span>
          <div className="text-xs text-off-white/60">Fee: {currentBroker?.fee}</div>
        </div>
      </div>
    </div>

    {/* Order Summary */}
    {quantity && parseFloat(quantity) > 0 && (
      <div className="bg-white/5 rounded-lg p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-off-white/60">Subtotal:</span>
          <span className="text-off-white">KES {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-off-white/60">Broker Fee:</span>
          <span className="text-off-white">KES {fee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-white/10 pt-2">
          <span className="text-off-white">Total:</span>
          <span className="text-secondary">KES {total.toFixed(2)}</span>
        </div>
      </div>
    )}

    {/* Place Order Button */}
    <Button 
      onClick={onPlaceOrder}
      className={`w-full font-bold py-3 ${
        orderSide === 'buy' 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-red-600 hover:bg-red-700 text-white'
      }`}
      disabled={!quantity || parseFloat(quantity) <= 0}
    >
      Place {orderSide} Order
    </Button>
  </>
);

export default OrderPanel;
