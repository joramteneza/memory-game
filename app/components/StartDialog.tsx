"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type StartDialogProps = {
    isOpen: boolean
    onClose: () => void
}

export default function StartDialog({ isOpen, onClose }: StartDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            {isOpen &&
                <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center">
                    <DialogContent className="bg-transparent border-0  text-white shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-center">🚀 Welcome to Memory Match Game</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center">
                            <Button
                                onClick={onClose}
                                variant="outline"
                                size="lg"
                                className="cursor-pointer bg-indigo-950 border-indigo-700 hover:bg-indigo-900 hover:border-indigo-500 text-indigo-200 hover:text-indigo-100"
                            >
                                Start Game
                            </Button>
                        </div>
                    </DialogContent>
                </div>
            }
        </Dialog>
    )
}
