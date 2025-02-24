import { useState, useEffect } from "react";
import { motion, AnimatePresence} from "motion/react"
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";

interface TeamInvitationNotificationProps {
  inviterName: string;
  teamName: string;
  onAccept: () => void;
  onDeny: () => void;
  handleNotificationClose: () => void;
  timeout?: number;
}

export default function TeamInvitationNotification({
  inviterName,
  teamName,
  onAccept,
  onDeny,
  handleNotificationClose,
  timeout = 7000,
}: TeamInvitationNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(handleNotificationClose, 350);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, handleNotificationClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="p-4 w-80 shadow-lg">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">{inviterName} invited to join the team:</p>
              <p className="text-lg font-bold">{teamName}</p>
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onDeny()
                    setTimeout(handleNotificationClose, 350);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Deny
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    onAccept()
                    setTimeout(handleNotificationClose, 350);
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Accept
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
