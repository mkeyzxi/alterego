import {useState, useMemo, useCallback} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {
  X,
  Flame,
  Heart,
  ClipboardList,
  Swords,
  Moon,
  Droplets,
  Footprints,
  TrendingUp,
  BarChart3,
} from 'lucide-react'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'

// ===== Types =====
interface DayRecord {
  date: string // ISO date string (YYYY-MM-DD)
  sleep: boolean
  water: number // 0-8
  walk: boolean
  totalScore: number // 0-100
}

type TimeFilter = '7days' | 'month' | 'all'

interface AdvancedStatisticsModalProps {
  isOpen: boolean
  onClose: () => void
  currentHabits: {sleep: boolean; water: number; walk: boolean}
  history: DayRecord[] // Menerima data history dari localStorage
}

// ===== Score Color Helper =====
function getScoreColor(score: number): string {
  if (score >= 70) return '#34d399' // green
  if (score >= 40) return '#fbbf24' // yellow
  return '#f87171' // red
}

function getScoreColorDim(score: number): string {
  if (score >= 70) return 'rgba(52, 211, 153, 0.6)'
  if (score >= 40) return 'rgba(251, 191, 36, 0.6)'
  return 'rgba(248, 113, 113, 0.6)'
}

// ===== Moving Average Calculator =====
function computeMovingAverage(data: DayRecord[], window: number = 3): number[] {
  const result: number[] = []
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1)
    const slice = data.slice(start, i + 1)
    const avg = slice.reduce((sum, d) => sum + d.totalScore, 0) / slice.length
    result.push(Math.round(avg * 10) / 10)
  }
  return result
}

// ===== Custom Tooltip =====
interface TooltipPayloadItem {
  value: number
  dataKey: string
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

function CustomChartTooltip({active, payload, label}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <p
        style={{
          margin: '0 0 8px 0',
          fontSize: '12px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </p>
      {payload.map((entry, idx) => (
        <p
          key={idx}
          style={{
            margin: '2px 0',
            fontSize: '13px',
            fontWeight: 600,
            color: entry.color || '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: entry.dataKey === 'movingAvg' ? '50%' : '2px',
              background: entry.color,
              display: 'inline-block',
            }}
          />
          {entry.dataKey === 'totalScore' ? 'Skor' : 'Rata-rata'}:{' '}
          <span style={{fontWeight: 800}}>{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

// ===== Main Component =====
export default function AdvancedStatisticsModal({
  isOpen,
  onClose,
  currentHabits,
  history,
}: AdvancedStatisticsModalProps) {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('7days')

  // Gabungkan riwayat murni dengan data hari ini secara dinamis
  const allData = useMemo(() => {
    const data = [...history]
    const today = new Date().toISOString().split('T')[0]

    // Kalkulasi skor asli hari ini
    const sleepScore = currentHabits.sleep ? 35 : 0
    const waterScore = Math.round((currentHabits.water / 8) * 40)
    const walkScore = currentHabits.walk ? 25 : 0
    const totalScore = Math.min(100, sleepScore + waterScore + walkScore)

    // Masukkan data klik real-time ke array grafik
    data.push({
      date: today,
      sleep: currentHabits.sleep,
      water: currentHabits.water,
      walk: currentHabits.walk,
      totalScore,
    })

    return data
  }, [history, currentHabits])

  // ===== Filter Logic =====
  const filteredData = useMemo(() => {
    const now = new Date()
    if (activeFilter === '7days') {
      const cutoff = new Date(now)
      cutoff.setDate(cutoff.getDate() - 7)
      return allData.filter((d) => new Date(d.date) >= cutoff)
    }
    if (activeFilter === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return allData.filter((d) => new Date(d.date) >= startOfMonth)
    }
    return allData // 'all'
  }, [activeFilter, allData])

  // ===== Top Level Metrics =====
  const metrics = useMemo(() => {
    let streak = 0
    for (let i = filteredData.length - 1; i >= 0; i--) {
      if (filteredData[i].totalScore >= 70) {
        streak++
      } else {
        break
      }
    }

    const avgScore =
      filteredData.length > 0
        ? Math.round(filteredData.reduce((s, d) => s + d.totalScore, 0) / filteredData.length)
        : 0

    const totalCheckins = filteredData.length

    let questsCompleted = 0
    filteredData.forEach((d) => {
      if (d.sleep) questsCompleted++
      if (d.water === 8) questsCompleted++
      if (d.walk) questsCompleted++
    })

    return {streak, avgScore, totalCheckins, questsCompleted}
  }, [filteredData])

  // ===== Chart Data =====
  const chartData = useMemo(() => {
    const movingAvg = computeMovingAverage(filteredData)
    return filteredData.map((d, i) => {
      const dateObj = new Date(d.date)
      const formattedDate =
        activeFilter === '7days'
          ? dateObj.toLocaleDateString('id-ID', {weekday: 'short'})
          : dateObj.toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})

      return {
        ...d,
        label: formattedDate,
        movingAvg: movingAvg[i],
      }
    })
  }, [filteredData, activeFilter])

  // ===== Habit Progress =====
  const habitProgress = useMemo(() => {
    // Merender progres dinamis sesuai aktivitas user hari ini
    return {
      sleep: currentHabits.sleep ? 100 : 0,
      water: Math.round((currentHabits.water / 8) * 100),
      walk: currentHabits.walk ? 100 : 0,
    }
  }, [currentHabits])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  // ===== Filter Buttons Config =====
  const filters: {key: TimeFilter; label: string}[] = [
    {key: '7days', label: '7 Hari'},
    {key: 'month', label: 'Bulan Ini'},
    {key: 'all', label: 'Semua'},
  ]

  // ===== Metric Cards Config =====
  const metricCards = [
    {
      icon: Flame,
      label: 'Streak Harian',
      value: `${metrics.streak} hari`,
      color: '#f97316',
      gradient: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.05))',
      border: 'rgba(249,115,22,0.3)',
    },
    {
      icon: Heart,
      label: 'Rata-rata Skor',
      value: `${metrics.avgScore}`,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(236,72,153,0.05))',
      border: 'rgba(236,72,153,0.3)',
    },
    {
      icon: ClipboardList,
      label: 'Total Check-in',
      value: `${metrics.totalCheckins}`,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))',
      border: 'rgba(99,102,241,0.3)',
    },
    {
      icon: Swords,
      label: 'Quest Selesai',
      value: `${metrics.questsCompleted}`,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
      border: 'rgba(16,185,129,0.3)',
    },
  ]

  // ===== Progress Bars Config =====
  const progressBars = [
    {
      icon: Moon,
      label: 'Tidur Tepat Waktu',
      value: habitProgress.sleep,
      color: '#818cf8',
      gradient: 'linear-gradient(90deg, #6366f1, #818cf8)',
    },
    {
      icon: Droplets,
      label: 'Minum Air 8/8',
      value: habitProgress.water,
      color: '#38bdf8',
      gradient: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
    },
    {
      icon: Footprints,
      label: 'Jalan Kaki',
      value: habitProgress.walk,
      color: '#34d399',
      gradient: 'linear-gradient(90deg, #10b981, #34d399)',
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="statistics-modal-backdrop"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.3}}
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            padding: '16px',
          }}
        >
          <motion.div
            id="statistics-modal-content"
            initial={{scale: 0.9, opacity: 0, y: 30}}
            animate={{scale: 1, opacity: 1, y: 0}}
            exit={{scale: 0.9, opacity: 0, y: 30}}
            transition={{type: 'spring', damping: 20, stiffness: 300}}
            style={{
              width: '100%',
              maxWidth: '860px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '0',
              boxShadow: '0 0 60px rgba(99, 102, 241, 0.15), 0 25px 50px rgba(0,0,0,0.5)',
            }}
          >
            {/* ===== Header ===== */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '24px 28px 0 28px',
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(99,102,241,0.3)',
                  }}
                >
                  <BarChart3 size={22} style={{color: 'white'}} />
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#e2e8f0',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Statistik Lanjutan
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.4)',
                      marginTop: '2px',
                    }}
                  >
                    Pantau perkembangan kebiasaanmu
                  </p>
                </div>
              </div>

              <motion.button
                id="statistics-modal-close"
                onClick={onClose}
                whileHover={{scale: 1.1, rotate: 90}}
                whileTap={{scale: 0.9}}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.5)',
                  flexShrink: 0,
                  transition: 'background 0.2s',
                }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* ===== Filter Tabs ===== */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                padding: '16px 28px 0 28px',
              }}
            >
              {filters.map((f) => (
                <motion.button
                  key={f.key}
                  id={`filter-${f.key}`}
                  onClick={() => setActiveFilter(f.key)}
                  whileHover={{scale: 1.05}}
                  whileTap={{scale: 0.95}}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border:
                      activeFilter === f.key
                        ? '1px solid rgba(99,102,241,0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                    background:
                      activeFilter === f.key
                        ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.1))'
                        : 'rgba(255,255,255,0.04)',
                    color: activeFilter === f.key ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {f.label}
                </motion.button>
              ))}
            </div>

            {/* ===== Content Grid ===== */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '20px',
                padding: '20px 28px 28px 28px',
              }}
              className="md:!grid-cols-2"
            >
              {/* ===== Left Column: Metric Cards ===== */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                  }}
                >
                  {metricCards.map((card, idx) => {
                    const Icon = card.icon
                    return (
                      <motion.div
                        key={card.label}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.1 + idx * 0.08}}
                        style={{
                          padding: '16px',
                          borderRadius: '14px',
                          background: card.gradient,
                          border: `1px solid ${card.border}`,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Decorative glow */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: card.color,
                            opacity: 0.08,
                            filter: 'blur(20px)',
                          }}
                        />
                        <Icon size={18} style={{color: card.color, marginBottom: '8px'}} />
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: 800,
                            color: '#e2e8f0',
                            lineHeight: 1.1,
                          }}
                        >
                          {card.value}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.45)',
                            marginTop: '4px',
                            letterSpacing: '0.3px',
                          }}
                        >
                          {card.label}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* ===== Habit Progress Bars (under metrics on mobile, under chart on desktop via CSS) ===== */}
                <motion.div
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.5}}
                  className="md:!hidden"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    padding: '18px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '2px',
                    }}
                  >
                    <TrendingUp size={16} style={{color: '#a5b4fc'}} />
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#a5b4fc',
                        letterSpacing: '0.5px',
                      }}
                    >
                      PROGRES KEBIASAAN
                    </span>
                  </div>
                  {progressBars.map((bar) => {
                    const Icon = bar.icon
                    return (
                      <div key={bar.label}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '6px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <Icon size={14} style={{color: bar.color}} />
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.7)',
                              }}
                            >
                              {bar.label}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: 800,
                              color: bar.color,
                            }}
                          >
                            {bar.value}%
                          </span>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '10px',
                            borderRadius: '5px',
                            background: 'rgba(255,255,255,0.06)',
                            overflow: 'hidden',
                          }}
                        >
                          <motion.div
                            initial={{width: 0}}
                            animate={{width: `${bar.value}%`}}
                            transition={{
                              duration: 1,
                              ease: 'easeOut',
                              delay: 0.3,
                            }}
                            style={{
                              height: '100%',
                              borderRadius: '5px',
                              background: bar.gradient,
                              boxShadow: `0 0 12px ${bar.color}40`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </motion.div>
              </div>

              {/* ===== Right Column: Chart ===== */}
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.3}}
                style={{
                  padding: '18px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  minHeight: '280px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <BarChart3 size={16} style={{color: '#a5b4fc'}} />
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#a5b4fc',
                        letterSpacing: '0.5px',
                      }}
                    >
                      SKOR HARIAN
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '2px',
                          background: '#34d399',
                          display: 'inline-block',
                        }}
                      />
                      Skor
                    </span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                      <span
                        style={{
                          width: '12px',
                          height: '2px',
                          borderRadius: '1px',
                          background: '#a5b4fc',
                          display: 'inline-block',
                        }}
                      />
                      Tren
                    </span>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={220}>
                  <ComposedChart data={chartData} margin={{top: 5, right: 5, bottom: 5, left: -10}}>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke="rgba(255,255,255,0.06)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: 'rgba(255,255,255,0.35)',
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                      dy={8}
                    />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: 'rgba(255,255,255,0.3)',
                        fontSize: 11,
                      }}
                      dx={-5}
                    />
                    <Tooltip
                      content={<CustomChartTooltip />}
                      cursor={{
                        fill: 'rgba(255,255,255,0.04)',
                        radius: 4,
                      }}
                    />
                    <Bar dataKey="totalScore" radius={[4, 4, 0, 0]} maxBarSize={28}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getScoreColorDim(entry.totalScore)}
                          stroke={getScoreColor(entry.totalScore)}
                          strokeWidth={1}
                        />
                      ))}
                    </Bar>
                    <Line
                      type="monotone"
                      dataKey="movingAvg"
                      stroke="#a5b4fc"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: '#a5b4fc',
                        stroke: '#1e293b',
                        strokeWidth: 2,
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>

              {/* ===== Desktop-only Progress Bars (spans full width on desktop) ===== */}
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.5}}
                className="hidden md:!flex"
                style={{
                  flexDirection: 'column',
                  gap: '14px',
                  padding: '18px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  gridColumn: '1 / -1',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '2px',
                  }}
                >
                  <TrendingUp size={16} style={{color: '#a5b4fc'}} />
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#a5b4fc',
                      letterSpacing: '0.5px',
                    }}
                  >
                    PROGRES KEBIASAAN HARIAN
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '16px',
                  }}
                >
                  {progressBars.map((bar) => {
                    const Icon = bar.icon
                    return (
                      <div key={bar.label}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <Icon size={14} style={{color: bar.color}} />
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.7)',
                              }}
                            >
                              {bar.label}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: 800,
                              color: bar.color,
                            }}
                          >
                            {bar.value}%
                          </span>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '12px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.06)',
                            overflow: 'hidden',
                          }}
                        >
                          <motion.div
                            initial={{width: 0}}
                            animate={{width: `${bar.value}%`}}
                            transition={{
                              duration: 1.2,
                              ease: 'easeOut',
                              delay: 0.4,
                            }}
                            style={{
                              height: '100%',
                              borderRadius: '6px',
                              background: bar.gradient,
                              boxShadow: `0 0 16px ${bar.color}40`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
