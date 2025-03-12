import React from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "./dialog";
  import { Button } from "./button";
  
  export const ConfirmationDialog = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false 
  }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">{message}</p>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button onClick={onConfirm} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };