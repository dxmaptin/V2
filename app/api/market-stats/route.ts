export const maxDuration = 30

interface MarketStats {
  totalPredictions: number
  activeUsers: number
  predictionAccuracy: number
  lastUpdated: string // 新增：上次更新时间
}

export async function GET() {
  console.log("[API] Starting V2 website stats generation...")

  try {
    // 生成全球同步的V2网站统计数据
    const stats = generateSynchronizedV2Stats()
    console.log("[API] Generated synchronized V2 website stats:", stats)
    return Response.json(stats)
  } catch (error) {
    console.error("[API] Error generating stats:", error)
    return Response.json(generateSynchronizedV2Stats())
  }
}

function generateSynchronizedV2Stats(): MarketStats {
  const now = new Date()

  // 🔄 **全球同步机制** - 使用UTC时间确保全球一致
  const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
  const hour = utcTime.getHours()
  const minute = utcTime.getMinutes()
  const dayOfWeek = utcTime.getDay()
  const dayOfMonth = utcTime.getDate()
  const monthOfYear = utcTime.getMonth()

  // 🎯 **同步种子** - 每5分钟更新一次，确保所有用户看到相同数据
  const syncInterval = 5 // 5分钟同步间隔
  const syncSeed = Math.floor(utcTime.getTime() / (syncInterval * 60 * 1000))

  console.log(`[Sync] UTC Time: ${utcTime.toISOString()}`)
  console.log(`[Sync] Sync Seed: ${syncSeed} (updates every ${syncInterval} minutes)`)

  // 📊 **活跃度计算** - 基于全球交易时间
  const isAsianTradingHours = hour >= 1 && hour <= 9 // 亚洲交易时间 (UTC)
  const isEuropeanTradingHours = hour >= 7 && hour <= 15 // 欧洲交易时间 (UTC)
  const isAmericanTradingHours = hour >= 13 && hour <= 21 // 美国交易时间 (UTC)
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5
  const isPeakTime = hour >= 14 && hour <= 16 // 全球重叠交易时间

  let globalActivityMultiplier = 1.0
  if (isAsianTradingHours) globalActivityMultiplier += 0.15
  if (isEuropeanTradingHours) globalActivityMultiplier += 0.2
  if (isAmericanTradingHours) globalActivityMultiplier += 0.25
  if (isWeekday) globalActivityMultiplier += 0.1
  if (isPeakTime) globalActivityMultiplier += 0.3

  // 🎲 **确定性随机数生成器** - 基于种子，确保所有设备产生相同的"随机"数
  const seededRandom = (seed: number, index = 0) => {
    const x = Math.sin(seed + index * 1000) * 10000
    return Math.abs(x - Math.floor(x))
  }

  // 📈 **1. 总预测次数** - V2网站累计预测
  const basePredictions = 9200 // 基础预测次数
  const dailyGrowth = dayOfMonth * 52 + monthOfYear * 180 // 每日+每月增长
  const hourlyPattern = Math.sin((hour * Math.PI) / 12) * 300 // 24小时周期模式
  const weeklyPattern = Math.sin((dayOfWeek * Math.PI) / 3.5) * 150 // 周期模式
  const randomVariation = (seededRandom(syncSeed, 1) - 0.5) * 200 // 确定性"随机"变化

  const totalPredictions = Math.floor(
    (basePredictions + dailyGrowth + hourlyPattern + weeklyPattern + randomVariation) * globalActivityMultiplier,
  )

  // 👥 **2. 活跃用户数** - 使用过V2的设备数量
  const avgPredictionsPerDevice = 3.8 + seededRandom(syncSeed, 2) * 1.4 // 3.8-5.2次/设备
  const deviceGrowthPattern = Math.sin((dayOfMonth * Math.PI) / 15) * 80
  const timeZoneBonus =
    (isAsianTradingHours ? 50 : 0) + (isEuropeanTradingHours ? 70 : 0) + (isAmericanTradingHours ? 90 : 0)
  const deviceRandomVariation = (seededRandom(syncSeed, 3) - 0.5) * 60

  const activeUsers = Math.floor(
    (totalPredictions / avgPredictionsPerDevice + deviceGrowthPattern + timeZoneBonus + deviceRandomVariation) * 0.88,
  )

  // 🎯 **3. 预测准确率** - V2 AI的动态准确率
  const baseAccuracy = 78.5 // 基础准确率
  const marketConditionFactor = Math.sin((hour * Math.PI) / 8) * 6 // 市场条件影响
  const weeklyPerformance = Math.cos((dayOfWeek * Math.PI) / 3) * 4 // 周表现变化
  const aiLearningBonus = (dayOfMonth / 31) * 2 // AI学习进步加成
  const accuracyRandomVariation = (seededRandom(syncSeed, 4) - 0.5) * 5

  let predictionAccuracy =
    baseAccuracy + marketConditionFactor + weeklyPerformance + aiLearningBonus + accuracyRandomVariation

  // 确保在合理范围内
  predictionAccuracy = Math.max(62.0, Math.min(91.5, predictionAccuracy))
  predictionAccuracy = Math.round(predictionAccuracy * 10) / 10 // 保留1位小数

  const stats: MarketStats = {
    totalPredictions: Math.max(8500, totalPredictions), // 最少8500次
    activeUsers: Math.max(1900, activeUsers), // 最少1900个设备
    predictionAccuracy: predictionAccuracy,
    lastUpdated: utcTime.toISOString(), // 返回UTC时间戳
  }

  console.log(`[V2Stats] 🌍 Global Synchronized Stats:`, stats)
  console.log(`[V2Stats] 🕐 Activity Multiplier: ${globalActivityMultiplier.toFixed(2)}`)
  console.log(`[V2Stats] 🔄 Next Update: ${new Date((syncSeed + 1) * syncInterval * 60 * 1000).toISOString()}`)

  return stats
}

// 🛡️ **备用同步函数** - 如果主函数失败
function generateBackupSyncStats(): MarketStats {
  const now = new Date()
  const utcMinutes = Math.floor(now.getTime() / (5 * 60 * 1000)) // 5分钟间隔

  // 简单但可靠的同步算法
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  const r1 = seededRandom(utcMinutes)
  const r2 = seededRandom(utcMinutes + 1)
  const r3 = seededRandom(utcMinutes + 2)

  return {
    totalPredictions: Math.floor(9000 + r1 * 2000), // 8500-10500
    activeUsers: Math.floor(2100 + r2 * 700), // 2000-2800
    predictionAccuracy: Math.round((70 + r3 * 20) * 10) / 10, // 70.0-90.0
    lastUpdated: now.toISOString(), // 备用也返回时间
  }
}
