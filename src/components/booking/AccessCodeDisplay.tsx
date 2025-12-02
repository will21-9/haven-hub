import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Key, QrCode } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface AccessCodeDisplayProps {
  code: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
}

export const AccessCodeDisplay = ({
  code,
  roomName,
  checkIn,
  checkOut,
}: AccessCodeDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrData = JSON.stringify({
    code,
    room: roomName,
    checkIn: checkIn.toISOString(),
    checkOut: checkOut.toISOString(),
  });

  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="bg-hero-gradient p-1" />
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Key className="h-5 w-5 text-secondary" />
          Your Access Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Code Display */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="flex items-center justify-center gap-2 rounded-xl bg-muted p-6">
            <div className="flex gap-2">
              {code.split('').map((digit, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex h-14 w-12 items-center justify-center rounded-lg bg-card text-2xl font-bold shadow-md"
                >
                  {digit}
                </motion.span>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </motion.div>

        {/* Room Info */}
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">Room</p>
          <p className="font-display text-lg font-semibold">{roomName}</p>
          <div className="mt-2 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>Check-in: {checkIn.toLocaleDateString()}</span>
            <span>•</span>
            <span>Check-out: {checkOut.toLocaleDateString()}</span>
          </div>
        </div>

        {/* QR Toggle */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowQR(!showQR)}
        >
          <QrCode className="mr-2 h-4 w-4" />
          {showQR ? 'Hide QR Code' : 'Show QR Code'}
        </Button>

        {/* QR Code */}
        {showQR && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex justify-center"
          >
            <div className="rounded-xl bg-card p-4 shadow-md">
              <QRCodeSVG
                value={qrData}
                size={200}
                level="H"
                includeMargin
                bgColor="transparent"
                fgColor="hsl(var(--foreground))"
              />
            </div>
          </motion.div>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Use this code on the room keypad or scan the QR code for entry
        </p>
      </CardContent>
    </Card>
  );
};
