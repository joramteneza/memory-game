"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Heart, Star, Sun, Moon, Cloud, Flower2, LucideIcon } from 'lucide-react'
import { toast } from "sonner"
import GameOverDialog from "./GameOverDialog"
import StartDialog from "./StartDialog"

type MemoryCard = {
  id: number
  icon: LucideIcon
  isMatched: boolean
  color: string
}

const createCards = () => {
  const iconConfigs = [
    { icon: Heart, color: "text-rose-400" },
    { icon: Star, color: "text-amber-400" },
    { icon: Sun, color: "text-yellow-400" },
    { icon: Moon, color: "text-purple-400" },
    { icon: Cloud, color: "text-sky-400" },
    { icon: Flower2, color: "text-emerald-400" }
  ]
  
  const cards: MemoryCard[] = []

  iconConfigs.forEach(({ icon, color }, index) => {
    cards.push(
      { id: index * 2, icon, color, isMatched: false },
      { id: index * 2 + 1, icon, color, isMatched: false }
    )
  })

  return cards.sort(() => Math.random() - 0.5)
}

export default function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>(createCards())
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number | null>(null)
  const [showGameOver, setShowGameOver] = useState(false)
  const [showStart, setShowStart] = useState(true)

  useEffect(() => {
    if (matches === 0) {
      setStartTime(Date.now()) // Start the timer when the game begins
      setElapsedTime(null)
    }
  }, [matches])

  const handleCardClick = (clickedIndex: number) => {
    if (isChecking || cards[clickedIndex].isMatched || flippedIndexes.includes(clickedIndex) || flippedIndexes.length === 2) return

    const newFlipped = [...flippedIndexes, clickedIndex]
    setFlippedIndexes(newFlipped)

    if (newFlipped.length === 2) {
      setIsChecking(true)
      const [firstIndex, secondIndex] = newFlipped
      const firstCard = cards[firstIndex]
      const secondCard = cards[secondIndex]

      if (firstCard.icon === secondCard.icon) {
        setTimeout(() => {
          setCards(cards.map((card, index) => 
            index === firstIndex || index === secondIndex
              ? { ...card, isMatched: true }
              : card
          ))
          setFlippedIndexes([])
          setMatches(m => {
            const newMatches = m + 1
            if (newMatches === cards.length / 2) {
              const timeTaken = (Date.now() - (startTime || 0)) / 1000
              setElapsedTime(timeTaken)
              toast(`🎉 Congratulations! You completed the game in ${timeTaken.toFixed(2)} seconds!`, {
                className: "bg-purple-900 text-purple-100 border-purple-700"
              })
              setShowGameOver(true)
            }
            return newMatches
          })
          setIsChecking(false)
        }, 500)
      } else {
        setTimeout(() => {
          setFlippedIndexes([])
          setIsChecking(false)
        }, 1000)
      }
    }
  }

//   const submitScore = async (score: number) => {
//     try {
//       const response = await fetch("/api/scores/anonymous", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ anonymousId, score }),
//       });

//       if (response.ok) {
//         toast("✅ Score submitted successfully!", {
//           className: "bg-green-900 text-green-100 border-green-700",
//         });
//       } else {
//         toast("❌ Failed to submit score.", {
//           className: "bg-red-900 text-red-100 border-red-700",
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting score:", error);
//       toast("⚠️ Network error. Try again later.", {
//         className: "bg-yellow-900 text-yellow-100 border-yellow-700",
//       });
//     }
//   };


  const resetGame = () => {
    setShowStart(false)
    setCards(createCards())
    setFlippedIndexes([])
    setMatches(0)
    setIsChecking(false)
    setStartTime(Date.now())
    setElapsedTime(null)
    setShowGameOver(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 text-transparent bg-clip-text">
          Memory Match Game
        </h1>
        <p className="text-indigo-200">
          Matches found: {matches} of {cards.length / 2}
        </p>
        {elapsedTime !== null && (
          <p className="text-green-300">Completion time: {elapsedTime.toFixed(2)} seconds</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 md:gap-6 p-6 rounded-xl bg-indigo-950/50 backdrop-blur-sm">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ rotateY: 0 }}
            animate={{
              rotateY: card.isMatched || flippedIndexes.includes(index) ? 180 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="perspective-1000"
          >
            <Card
              className={`relative w-24 h-24 md:w-32 md:h-32 cursor-pointer transform-style-3d transition-all duration-300 ${
                card.isMatched
                  ? "bg-indigo-900/50 border-indigo-400/50"
                  : flippedIndexes.includes(index)
                  ? "bg-indigo-800/50 border-indigo-500/50"
                  : "bg-indigo-950 border-indigo-800 hover:border-indigo-600 hover:bg-indigo-900/80"
              }`}
              onClick={() => handleCardClick(index)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-500/5 to-white/5" />
              <AnimatePresence>
                {(card.isMatched || flippedIndexes.includes(index)) && (
                  <div className="absolute inset-0 flex items-center justify-center backface-hidden">
                    <card.icon
                      className={`w-12 h-12 ${
                        card.isMatched 
                          ? `${card.color} filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]` 
                          : card.color
                      }`}
                    />
                  </div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>


      
      <StartDialog isOpen={showStart} onClose={resetGame} />
      <GameOverDialog isOpen={showGameOver} timeTaken={elapsedTime} onClose={resetGame} />

    </div>
  )
}
