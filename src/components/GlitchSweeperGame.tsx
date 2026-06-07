import {useState, useEffect, useCallback, useRef} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {X, Zap, Timer, Target} from 'lucide-react'

interface GlitchSweeperGameProps {
  isActive: boolean
  onComplete: (score: number) => void
  onClose: () => void
}

interface Virus {
  id: number
  x: number
  y: number
  size: number
  lifetime: number
  createdAt: number
}

const GAME_DURATION = 30
const SPAWN_INTERVAL = 800
const VIRUS_LIFETIME = 2500
const VIRUS_SYMBOLS = ['▓', '█', '░', '▒', '✕', '⚡', '☠', '⬣']

export default function GlitchSweeperGame({isActive, onComplete, onClose}: GlitchSweeperGameProps) {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [score, setScore] = useState(0)
  const [viruses, setViruses] = useState<Virus[]>([])
  const [gamePhase, setGamePhase] = useState<'countdown' | 'playing' | 'result'>('countdown')
  const [countdown, setCountdown] = useState(3)
  const [combo, setCombo] = useState(0)
  const [showCombo, setShowCombo] = useState(false)
  const virusIdRef = useRef(0)
  const areaRef = useRef<HTMLDivElement>(null)

  // Countdown phase
  useEffect(() => {
    if (!isActive) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGamePhase('countdown')
    setCountdown(3)
    setScore(0)
    setViruses([])
    setCombo(0)
    setTimeLeft(GAME_DURATION)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setGamePhase('playing')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive])

  // Game timer
  useEffect(() => {
    if (gamePhase !== 'playing') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setGamePhase('result')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gamePhase])

  // Virus spawner
  useEffect(() => {
    if (gamePhase !== 'playing') return

    const spawner = setInterval(() => {
      const id = ++virusIdRef.current
      setViruses((prev) => [
        ...prev,
        {
          id,
          x: 5 + Math.random() * 85,
          y: 5 + Math.random() * 80,
          size: 30 + Math.random() * 30,
          lifetime: VIRUS_LIFETIME,
          createdAt: Date.now(),
        },
      ])
    }, SPAWN_INTERVAL)

    return () => clearInterval(spawner)
  }, [gamePhase])

  // Clean expired viruses
  useEffect(() => {
    if (gamePhase !== 'playing') return

    const cleaner = setInterval(() => {
      const now = Date.now()
      setViruses((prev) => prev.filter((v) => now - v.createdAt < v.lifetime))
    }, 200)

    return () => clearInterval(cleaner)
  }, [gamePhase])

  // Handle virus click
  const handleVirusClick = useCallback(
    (virusId: number) => {
      setViruses((prev) => prev.filter((v) => v.id !== virusId))
      setCombo((prev) => prev + 1)
      setShowCombo(true)

      const comboMultiplier = Math.min(1 + combo * 0.1, 3)
      const points = Math.round(10 * comboMultiplier)
      setScore((prev) => prev + points)

      setTimeout(() => setShowCombo(false), 600)
    },
    [combo],
  )

  // Reset combo on miss (clicking empty area)
  const handleMiss = useCallback(() => {
    setCombo(0)
  }, [])

  // Result phase
  useEffect(() => {
    if (gamePhase === 'result') {
      const timer = setTimeout(() => {
        onComplete(score)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [gamePhase, score, onComplete])

  if (!isActive) return null

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Close Button */}
      <motion.button
        whileHover={{scale: 1.1}}
        whileTap={{scale: 0.9}}
        onClick={() => {
          onComplete(score)
          onClose()
        }}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 50,
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        <X size={20} />
      </motion.button>

      {/* Countdown */}
      <AnimatePresence>
        {gamePhase === 'countdown' && (
          <motion.div
            key={countdown}
            initial={{scale: 2, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 0.5, opacity: 0}}
            transition={{duration: 0.5}}
            style={{
              fontSize: '120px',
              fontWeight: 900,
              color: '#10b981',
              textShadow: '0 0 40px rgba(16, 185, 129, 0.5)',
            }}
          >
            {countdown}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playing Phase */}
      {gamePhase === 'playing' && (
        <>
          {/* HUD */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              right: '60px',
              display: 'flex',
              gap: '16px',
              zIndex: 42,
            }}
          >
            {/* Timer */}
            <div
              className="glass-panel"
              style={{
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Timer
                size={18}
                style={{
                  color: timeLeft <= 10 ? '#f87171' : '#10b981',
                }}
              />
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: timeLeft <= 10 ? '#f87171' : '#e2e8f0',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {timeLeft}s
              </span>
            </div>

            {/* Score */}
            <div
              className="glass-panel"
              style={{
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Target size={18} style={{color: '#f59e0b'}} />
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#e2e8f0',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {score}
              </span>
            </div>

            {/* Combo */}
            <AnimatePresence>
              {showCombo && combo > 1 && (
                <motion.div
                  initial={{scale: 0, opacity: 0}}
                  animate={{scale: 1, opacity: 1}}
                  exit={{scale: 0.5, opacity: 0}}
                  className="glass-panel"
                  style={{
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Zap size={18} style={{color: '#f59e0b'}} />
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 800,
                      color: '#f59e0b',
                    }}
                  >
                    x{combo} COMBO!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Game Area */}
          <div
            ref={areaRef}
            onClick={handleMiss}
            style={{
              position: 'absolute',
              inset: '80px 16px 16px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
            }}
          >
            <AnimatePresence>
              {viruses.map((virus) => {
                const symbol = VIRUS_SYMBOLS[virus.id % VIRUS_SYMBOLS.length]

                return (
                  <motion.button
                    key={virus.id}
                    initial={{scale: 0, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0, opacity: 0, rotate: 180}}
                    transition={{duration: 0.3}}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVirusClick(virus.id)
                    }}
                    style={{
                      position: 'absolute',
                      left: `${virus.x}%`,
                      top: `${virus.y}%`,
                      width: `${virus.size}px`,
                      height: `${virus.size}px`,
                      borderRadius: '50%',
                      background:
                        'radial-gradient(circle, rgba(239, 68, 68, 0.6), rgba(127, 29, 29, 0.8))',
                      border: '2px solid rgba(239, 68, 68, 0.8)',
                      boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: `${virus.size * 0.5}px`,
                      color: '#f87171',
                      fontWeight: 900,
                      padding: 0,
                    }}
                    whileHover={{scale: 1.2}}
                    whileTap={{scale: 0.5}}
                  >
                    {symbol}
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Result Phase */}
      <AnimatePresence>
        {gamePhase === 'result' && (
          <motion.div
            initial={{scale: 0.5, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 0.5, opacity: 0}}
            className="glass-panel"
            style={{
              padding: '40px 50px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                marginBottom: '12px',
              }}
            >
              {score >= 200 ? '🏆' : score >= 100 ? '⭐' : '👍'}
            </div>
            <h2
              style={{
                color: '#e2e8f0',
                fontSize: '28px',
                fontWeight: 900,
                marginBottom: '8px',
              }}
            >
              MISI SELESAI!
            </h2>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 900,
                color: '#10b981',
                textShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                marginBottom: '8px',
              }}
            >
              {score}
            </div>
            <p
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Poin diperoleh • Mystery Box terbuka!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
