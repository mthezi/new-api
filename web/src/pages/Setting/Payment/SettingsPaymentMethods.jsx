/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Form, Table, Space, Typography, Spin, InputNumber, Input } from '@douyinfe/semi-ui';
import { API, showError, showSuccess, verifyJSON } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';

const { Text } = Typography;

const DEFAULT_METHOD = { name: '', type: '', color: '', ratio: '1' };

export default function SettingsPaymentMethods({ options, refresh }) {
  const { t } = useTranslation();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (options?.PayMethods) {
        const list = JSON.parse(options.PayMethods);
        if (Array.isArray(list)) setMethods(list);
      }
    } catch (e) {
      // ignore
    }
  }, [options?.PayMethods]);

  const columns = [
    {
      title: t('名称'),
      dataIndex: 'name',
      render: (text, record, idx) => (
        <Input value={record.name} onChange={(v) => updateMethod(idx, { name: v })} />
      ),
    },
    {
      title: t('类型'),
      dataIndex: 'type',
      render: (text, record, idx) => (
        <Input
          value={record.type}
          placeholder='alipay | wxpay | stripe | ...'
          onChange={(v) => updateMethod(idx, { type: v })}
        />
      ),
    },
    {
      title: t('颜色'),
      dataIndex: 'color',
      render: (text, record, idx) => (
        <Input
          value={record.color}
          placeholder='rgba(var(--semi-blue-5), 1)'
          onChange={(v) => updateMethod(idx, { color: v })}
        />
      ),
    },
    {
      title: t('倍率'),
      dataIndex: 'ratio',
      render: (text, record, idx) => (
        <InputNumber
          value={parseFloat(record.ratio || '1')}
          min={0}
          step={0.01}
          onChange={(v) => updateMethod(idx, { ratio: String(v) })}
        />
      ),
    },
    {
      title: t('操作'),
      dataIndex: 'op',
      render: (text, record, idx) => (
        <Button
          type='danger'
          icon={<Trash2 size={14} />}
          onClick={() => removeMethod(idx)}
        >
          {t('删除')}
        </Button>
      ),
    },
  ];

  const updateMethod = (idx, patch) => {
    setMethods((list) => {
      const n = [...list];
      n[idx] = { ...n[idx], ...patch };
      return n;
    });
  };

  const removeMethod = (idx) => {
    setMethods((list) => list.filter((_, i) => i !== idx));
  };

  const addMethod = () => {
    setMethods((list) => [...list, { ...DEFAULT_METHOD }]);
  };

  const save = async () => {
    setLoading(true);
    try {
      const payload = JSON.stringify(methods);
      const res = await API.put('/api/option/', { key: 'PayMethods', value: payload });
      if (res?.data?.success) {
        showSuccess(t('保存成功'));
        refresh && refresh();
      } else {
        showError(res?.data?.message || t('保存失败，请重试'));
      }
    } catch (e) {
      showError(t('保存失败，请重试'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Space vertical style={{ width: '100%' }}>
        <div className='flex items-center'>
          <Text strong>{t('充值方式管理')}</Text>
        </div>
        <Table
          columns={columns}
          dataSource={methods.map((m, i) => ({ key: i, ...m }))}
          pagination={false}
        />
        <div className='flex items-center justify-end gap-2'>
          <Button icon={<Plus size={14} />} onClick={addMethod}>
            {t('新增方式')}
          </Button>
          <Button type='primary' onClick={save}>
            {t('保存设置')}
          </Button>
        </div>
      </Space>
    </Spin>
  );
}
