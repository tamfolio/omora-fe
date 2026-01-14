// qoreid.d.ts
import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'qoreid-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        clientId?: string;
        productCode?: string;
        customerReference?: string;
        applicantData?: string;
        identityData?: string;
        id?: string;
      };
    }
  }
}