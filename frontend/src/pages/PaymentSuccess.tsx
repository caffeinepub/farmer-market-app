import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Home, LayoutDashboard } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <Card className="border-green-200 shadow-card">
          <CardContent className="py-12 px-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-3 text-green-800">Payment Successful!</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Your transaction was completed successfully.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate({ to: '/seeker' })} className="w-full bg-portal-600 hover:bg-portal-700 text-white">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/' })} className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
