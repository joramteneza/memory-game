"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import SubmitForm from "./SubmitForm"

type GameOverDialogProps = {
  isOpen: boolean
  timeTaken: number | null
  onClose: () => void
}

export default function GameOverDialog({ isOpen, timeTaken, onClose }: GameOverDialogProps) {
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={() => { }}>
      {isOpen &&
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center">
          <DialogContent className="bg-transparent border-0  text-white shadow-xl items-center justify-center">

            {
              showSubmitForm ?
                <SubmitForm score={timeTaken ?? 0} onPlay={() => {
                  onClose()
                  setShowSubmitForm(false)
                }} onClose={() => setShowSubmitForm(false)} /> :
                <>
                  <DialogHeader className="flex items-center justify-center">
                    <DialogTitle>🎉 Game Over!</DialogTitle>
                  </DialogHeader>
                  <p className="flex items-center justify-center gap-1.5">Score: <span className="text-green-400 font-semibold">{timeTaken?.toFixed(2)} seconds</span></p>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => setShowSubmitForm(true)}
                      variant="outline"
                      size="lg"
                      className="cursor-pointer bg-indigo-950 border-indigo-700 hover:bg-indigo-900 hover:border-indigo-500 text-indigo-200 hover:text-indigo-100"
                    >
                      Submit Score
                    </Button>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      size="lg"
                      className="cursor-pointer bg-indigo-950 border-indigo-700 hover:bg-indigo-900 hover:border-indigo-500 text-indigo-200 hover:text-indigo-100"
                    >
                      Play Again
                    </Button>
                  </div>
                </>
            }
          </DialogContent>
        </div>
      }
    </Dialog>
  )
}
