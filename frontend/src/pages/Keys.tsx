import { Card, Table, Alert } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { startTransition, useEffect, useState } from 'react'
import { fetchTokens } from '../api/token'
import type { TokenRow } from '../api/types'

export default function Keys() {
  const [rows, setRows] = useState<TokenRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    startTransition(() => {
      setLoading(true)
      setErr(null)
    })
    fetchTokens(page, pageSize)
      .then((data) => {
        if (cancelled) return
        setRows(data.items || [])
        setTotal(data.total)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setErr(e instanceof Error ? e.message : '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [page, pageSize])

  const columns: ColumnsType<TokenRow> = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '名称', dataIndex: 'name' },
    { title: 'Key（脱敏）', dataIndex: 'key', ellipsis: true },
    { title: '分组', dataIndex: 'group', width: 100 },
    {
      title: '剩余额度',
      dataIndex: 'remain_quota',
      width: 110,
      render: (_, r) => (r.unlimited_quota ? '无限' : r.remain_quota),
    },
    { title: '已用额度', dataIndex: 'used_quota', width: 110 },
    { title: '状态', dataIndex: 'status', width: 80 },
  ]

  return (
    <Card title="API 密钥">
      {err ? <Alert type="error" message={err} showIcon style={{ marginBottom: 16 }} /> : null}
      <Table<TokenRow>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          onChange: (p, ps) => {
            setPage(p)
            setPageSize(ps || 20)
          },
        }}
      />
    </Card>
  )
}
