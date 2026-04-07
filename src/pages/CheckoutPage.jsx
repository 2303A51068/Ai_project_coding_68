import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState('shipping'); // 'shipping', 'payment', 'confirmation'
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 12000 ? 0 : 500;
  const tax = (subtotal * 0.18);
  const total = subtotal + shipping + tax;

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

  const handlePlaceOrder = () => {
    if (!validatePayment()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOrderConfirmation({
        orderId: `ORD-${Date.now()}`,
        total,
        email: formData.email,
        items: cartItems,
      });
      setStep('confirmation');
      clearCart();
    }, 1500);
  };

  if (cartItems.length === 0 && !orderConfirmation) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <Link to="/cart" className="text-rose-500 font-semibold hover:text-rose-600">
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  if (orderConfirmation) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <Icons.CheckCircle size={48} className="text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">Thank you for your purchase</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Order ID</p>
              <p className="text-2xl font-bold text-gray-900 mb-4">{orderConfirmation.orderId}</p>
              <p className="text-sm text-gray-600 mb-2">Total Amount</p>
              <p className="text-2xl font-bold text-rose-500">${orderConfirmation.total}</p>
            </div>

            <p className="text-gray-600 mb-6">A confirmation email has been sent to <strong>{orderConfirmation.email}</strong></p>

            <div className="space-y-3">
              <Link to="/" className="block w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition">
                Continue Shopping
              </Link>
              <Link to="/" className="block w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8 flex gap-4">
          {['shipping', 'payment', 'confirmation'].map((s, idx) => (
            <div key={s} className="flex-1">
              <div className={`h-2 rounded-full transition mb-2 ${(step === s || (step === 'payment' && s === 'shipping')) ? 'bg-rose-500' : 'bg-gray-300'}`} />
              <p className="text-sm font-semibold text-gray-700 capitalize">{s}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              {step === 'shipping' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Shipping Address</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input type="text" name="state" value={formData.state} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>
                  <button onClick={() => validateShipping() && setStep('payment')} className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition">
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Payment Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                      <input type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="0000 0000 0000 0000" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
                      <input type="text" name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="MM/YY" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.expiry ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="000" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep('shipping')} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                      Back
                    </button>
                    <button onClick={handlePlaceOrder} disabled={loading} className="flex-1 bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition disabled:opacity-50">
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.title} x {item.quantity}</span>
                    <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-rose-500">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
