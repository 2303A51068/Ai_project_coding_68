import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import * as Icons from 'lucide-react';

export default function Payment({ onClose, onSuccess }) {
  const { getTotalPrice, cartItems } = useCart();
  const [step, setStep] = useState('summary'); // 'summary', 'shipping', 'payment', 'confirmation'
  const [formData, setFormData] = useState({
    // Shipping Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Payment Info
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    
    // Billing Address
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateShipping = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone required';
    if (!formData.address.trim()) newErrors.address = 'Address required';
    if (!formData.city.trim()) newErrors.city = 'City required';
    if (!formData.state.trim()) newErrors.state = 'State required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name required';
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) newErrors.cardNumber = 'Valid 16-digit card number required';
    if (!formData.expiry.match(/^\d{2}\/\d{2}$/)) newErrors.expiry = 'Format: MM/YY';
    if (!formData.cvv.match(/^\d{3}$/)) newErrors.cvv = 'Valid 3-digit CVV required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 'summary') {
      setStep('shipping');
    } else if (step === 'shipping') {
      if (validateShipping()) {
        setStep('payment');
      }
    } else if (step === 'payment') {
      if (validatePayment()) {
        setStep('confirmation');
      }
    }
  };

  const handlePrevStep = () => {
    if (step !== 'summary') {
      setStep(step === 'shipping' ? 'summary' : step === 'payment' ? 'shipping' : 'payment');
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onSuccess({
        orderId: `ORD-${Date.now()}`,
        total: getTotalPrice(),
        email: formData.email,
        items: cartItems,
      });
    }, 1500);
  };

  const totalPrice = getTotalPrice();
  const subtotal = totalPrice;
  const shippingCost = subtotal > 150 ? 0 : 10;
  const tax = (subtotal * 0.1).toFixed(2);
  const finalTotal = (parseFloat(subtotal) + shippingCost + parseFloat(tax)).toFixed(2);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />

      {/* Payment Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 my-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Checkout</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Icons.X size={24} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex gap-4">
            {['summary', 'shipping', 'payment', 'confirmation'].map((s, idx) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-2 rounded-full transition ${
                    (step === s) || (['summary', 'shipping', 'payment', 'confirmation'].indexOf(step) > ['summary', 'shipping', 'payment', 'confirmation'].indexOf(s))
                      ? 'bg-rose-500'
                      : 'bg-gray-300'
                  }`}
                />
                <p className="mt-2 text-sm font-semibold text-gray-700 capitalize">
                  {s === 'summary' && 'Order Summary'}
                  {s === 'shipping' && 'Shipping'}
                  {s === 'payment' && 'Payment'}
                  {s === 'confirmation' && 'Confirmation'}
                </p>
              </div>
            ))}
          </div>

          {/* Order Summary Step */}
          {step === 'summary' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center pb-3 border-b">
                      <div className="flex gap-4">
                        <img src={item.image} alt={item.title} className="h-12 w-12 object-contain bg-white rounded" />
                        <div>
                          <p className="font-semibold text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-rose-500">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{shippingCost === 0 ? 'FREE (Order > $150)' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%):</span>
                  <span>${tax}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 text-rose-500">
                  <span>Total:</span>
                  <span>${finalTotal}</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Icons.Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold">Free Shipping Available!</p>
                  <p>Orders over $150 qualify for free shipping. Add ${Math.max(0, (150 - subtotal).toFixed(2))} more to unlock free shipping!</p>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Step */}
          {step === 'shipping' && (
            <form className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Shipping Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="123 Main St"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="New York"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="NY"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="10001"
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Options */}
              <div>
                <h3 className="text-lg font-bold mb-4">Shipping Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-rose-500 rounded-lg cursor-pointer bg-rose-50">
                    <input type="radio" name="shipping" defaultChecked className="mr-3" />
                    <div className="flex-1">
                      <p className="font-semibold">Standard Shipping</p>
                      <p className="text-sm text-gray-600">5-7 business days</p>
                    </div>
                    <span className="font-bold">{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-rose-500">
                    <input type="radio" name="shipping" className="mr-3" />
                    <div className="flex-1">
                      <p className="font-semibold">Express Shipping</p>
                      <p className="text-sm text-gray-600">2-3 business days</p>
                    </div>
                    <span className="font-bold">$25.00</span>
                  </label>
                </div>
              </div>
            </form>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <form className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Payment Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="John Doe"
                    />
                    {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\s/g, '');
                        val = val.replace(/(\d{4})/g, '$1 ').trim();
                        handleInputChange({ target: { name: 'cardNumber', value: val } });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={formData.expiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) {
                            val = val.slice(0, 2) + '/' + val.slice(2, 4);
                          }
                          handleInputChange({ target: { name: 'expiry', value: val } });
                        }}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.expiry ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                      {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '').slice(0, 3);
                          handleInputChange({ target: { name: 'cvv', value: val } });
                        }}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="123"
                        maxLength="3"
                      />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  <label className="flex items-center gap-3 mt-4">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Billing address same as shipping</span>
                  </label>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <Icons.Lock size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-semibold">Secure Payment</p>
                  <p>Your payment information is encrypted and secure. We accept all major credit cards.</p>
                </div>
              </div>
            </form>
          )}

          {/* Confirmation Step */}
          {step === 'confirmation' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-green-100 rounded-full p-6">
                  <Icons.CheckCircle size={48} className="text-green-600" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h3>
                <p className="text-gray-600">Your order has been placed successfully.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-700">Order ID:</span>
                  <span className="font-semibold">ORD-{Date.now()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Email:</span>
                  <span className="font-semibold">{formData.email}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-700">Total Amount:</span>
                  <span className="font-bold text-rose-500">${finalTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping Address:</span>
                  <span className="font-semibold text-right max-w-xs">{formData.address}, {formData.city}, {formData.state} {formData.zipCode}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  A confirmation email has been sent to <span className="font-semibold">{formData.email}</span>. You can track your order status anytime.
                </p>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="mt-8 flex gap-4 justify-end">
            {step !== 'confirmation' && (
              <>
                {step !== 'summary' && (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                )}
                
                {step !== 'confirmation' && (
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition"
                  >
                    {step === 'payment' ? 'Review Order' : 'Continue'}
                  </button>
                )}
              </>
            )}

            {step === 'confirmation' && (
              <button
                onClick={() => {
                  handlePlaceOrder();
                  onClose();
                }}
                className="px-6 py-2 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition"
              >
                Back to Shopping
              </button>
            )}

            {step === 'confirmation' && (
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Icons.Loader size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Icons.Check size={18} />
                    Complete Purchase
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
