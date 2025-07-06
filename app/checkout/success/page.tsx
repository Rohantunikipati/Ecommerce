import Link from "next/link"
import { CheckCircle, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutSuccessPage() {
  const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Order Number:</span>
              <span className="font-mono font-semibold">#{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery:</span>
              <span>3-5 business days</span>
            </div>
            <div className="flex justify-between">
              <span>Tracking Available:</span>
              <span>Within 24 hours</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Order Processing</h3>
              <p className="text-sm text-muted-foreground">We'll prepare your items for shipping</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">Your order will be delivered soon</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            A confirmation email has been sent to your email address with order details and tracking information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg">Continue Shopping</Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline" size="lg">
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
