import React from 'react';

type PaymentStatus = 'success' | 'failed' | 'pending';

interface PaymentStatusPageProps {
  status?: PaymentStatus;
  orderId?: string;
  amount?: number;
  currency?: string;
}

export default function PaymentStatusPage({
  status = 'success',
  orderId = 'ORD-2024-10-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
  amount = 799998,
  currency = 'đ',
}: PaymentStatusPageProps) {
  const statusConfig = {
    success: {
      icon: (
        <svg className="w-24 h-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: 'Payment Successful!',
      subtitle: 'Your order has been confirmed',
      bgGradient: 'from-green-50 to-emerald-50',
      accentColor: 'bg-green-600 hover:bg-green-700',
      iconBg: 'bg-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      lightBg: 'bg-green-50',
      buttonText: 'Continue Shopping',
      secondaryButtonText: 'View Order Details',
    },
    failed: {
      icon: (
        <svg className="w-24 h-24 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      title: 'Payment Failed',
      subtitle: 'Something went wrong with your payment',
      bgGradient: 'from-red-50 to-pink-50',
      accentColor: 'bg-red-600 hover:bg-red-700',
      iconBg: 'bg-red-100',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      lightBg: 'bg-red-50',
      buttonText: 'Try Again',
      secondaryButtonText: 'Contact Support',
    },
    pending: {
      icon: (
        <svg className="w-24 h-24 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Processing Payment...',
      subtitle: 'Please wait while we confirm your payment',
      bgGradient: 'from-yellow-50 to-amber-50',
      accentColor: 'bg-yellow-600 hover:bg-yellow-700',
      iconBg: 'bg-yellow-100',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-900',
      lightBg: 'bg-yellow-50',
      buttonText: 'Refresh Status',
      secondaryButtonText: 'Cancel',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex items-center justify-center p-4`}>
      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-lg w-full">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`${config.iconBg} rounded-full p-4`}>
            <>
            {config.icon}
            </>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-900">
          {config.title}
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-center text-sm mb-6">
          {config.subtitle}
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3 text-sm">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Order ID:</span>
            <span className="font-mono font-bold text-gray-900 text-xs">{orderId}</span>
          </div>
          
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Amount Paid:</span>
            <span className="text-xl font-bold text-gray-900">
              {amount.toLocaleString()} {currency}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Payment Method:</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 font-semibold">VnPay</span>
              <span className="text-lg">🇻🇳</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Date & Time:</span>
            <span className="text-gray-900 font-semibold text-xs">
              {new Date().toLocaleString('en-GB', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Status Message */}
        {status === 'success' && (
          <div className={`${config.lightBg} border-2 ${config.borderColor} rounded-xl p-4 mb-8`}>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className={`font-semibold ${config.textColor} mb-1`}>What's Next?</h3>
                <p className="text-sm text-green-700">
                  A confirmation email has been sent to your inbox. Your order will be processed within 24 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className={`${config.lightBg} border-2 ${config.borderColor} rounded-xl p-4 mb-8`}>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className={`font-semibold ${config.textColor} mb-1`}>Why did this happen?</h3>
                <p className="text-sm text-red-700">
                  Your payment couldn't be processed. This could be due to insufficient funds, incorrect payment details, or a network issue.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'pending' && (
          <div className={`${config.lightBg} border-2 ${config.borderColor} rounded-xl p-4 mb-8`}>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className={`font-semibold ${config.textColor} mb-1`}>Please Wait</h3>
                <p className="text-sm text-yellow-700">
                  Your payment is being processed. This usually takes a few moments. Please don't close this page.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className={`flex-1 ${config.accentColor} text-white font-bold py-4 rounded-full transition-colors shadow-lg`}>
            {config.buttonText}
          </button>
          <button className="flex-1 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-4 rounded-full transition-colors">
            {config.secondaryButtonText}
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900 transition-colors">Track Order</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-gray-900 transition-colors">Download Invoice</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-gray-900 transition-colors">Help Center</a>
        </div>
      </div>
    </div>
  );
}