"use client"

import React from 'react';
import ConversionTable from '@/components/approval/ConversionTable';

const ConversionTab = () => {
  return (
    <div>
      <ConversionTable title="NGN - USDT Conversion" />
      <div style={{ marginTop: '24px' }}>
        <ConversionTable title="USDT - NGN Conversion" />
      </div>
    </div>
  );
};

export default ConversionTab;
