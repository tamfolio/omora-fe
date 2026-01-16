"use client";
import React from "react";

interface TransactionData {
  id: string;
  type: string;
  date: string;
  amount: string;
  fee: string;
  status: string;
  referenceId: string;
  walletAddress?: string;
  blockchain?: string;
  bankName?: string;
  accountNumber?: string;
  senderName?: string;
  receivingAccount?: string;
  conversion?: string;
  sourceWallet?: string;
  destinationWallet?: string;
  amountConverted?: string;
  fxRateUsed?: string;
  convertedValue?: string;
}

interface PDFHelperProps {
  transactionData: TransactionData;
  transactionType: string;
}

export default function PDFHelper({
  transactionData,
  transactionType,
}: PDFHelperProps) {
  const generatePDFContent = () => {
    const getTransactionTitle = () => {
      switch (transactionType.toLowerCase()) {
        case "funding":
          return "Funding Transaction Receipt";
        case "withdrawal":
          return transactionData.type === "USDT Withdrawal"
            ? "USDT Withdrawal Transaction Receipt"
            : "NGN Withdrawal Transaction Receipt";
        case "conversion":
          return "Conversion Transaction Receipt";
        default:
          return "Transaction Receipt";
      }
    };

    const getSpecificFields = () => {
      switch (transactionType.toLowerCase()) {
        case "funding":
          return `
            <tr><td>Sender's Name</td><td>${transactionData.senderName}</td></tr>
            <tr><td>Receiving Account</td><td>${transactionData.receivingAccount}</td></tr>
          `;

        case "withdrawal":
          if (transactionData.type === "USDT Withdrawal") {
            return `
              <tr><td>Wallet Address</td><td>${transactionData.walletAddress}</td></tr>
              <tr><td>Blockchain used</td><td>${transactionData.blockchain}</td></tr>
            `;
          } else {
            return `
              <tr><td>Bank Name</td><td>${transactionData.bankName}</td></tr>
              <tr><td>Account Number</td><td>${transactionData.accountNumber}</td></tr>
            `;
          }

        case "conversion":
          return `
            <tr><td>Conversion</td><td>${transactionData.conversion}</td></tr>
            <tr><td>Source Wallet</td><td>${transactionData.sourceWallet}</td></tr>
            <tr><td>Destination Wallet</td><td>${transactionData.destinationWallet}</td></tr>
            <tr><td>Amount Converted</td><td>${transactionData.amountConverted}</td></tr>
            <tr><td>FX Rate Used</td><td>${transactionData.fxRateUsed}</td></tr>
            <tr><td>Converted Value</td><td>${transactionData.convertedValue}</td></tr>
          `;

        default:
          return "";
      }
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${getTransactionTitle()}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #0d9488;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #0d9488;
            margin-bottom: 10px;
          }
          .title {
            font-size: 20px;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .subtitle {
            color: #6b7280;
            font-size: 14px;
          }
          .content {
            margin: 30px 0;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .details-table td {
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .details-table td:first-child {
            color: #6b7280;
            width: 40%;
          }
          .details-table td:last-child {
            font-weight: 500;
            color: #1f2937;
            text-align: right;
          }
          .status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            background-color: #059669;
            border-radius: 50%;
          }
          .status-text {
            color: #059669;
            font-weight: 500;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
          }
          @media print {
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">OMORA</div>
          <div class="title">${getTransactionTitle()}</div>
          <div class="subtitle">Transaction Details</div>
        </div>

        <div class="content">
          <table class="details-table">
            <tr><td>Transaction Date</td><td>${transactionData.date}</td></tr>
            <tr><td>Transaction Type</td><td>${transactionData.type}</td></tr>
            <tr><td>Amount</td><td>${transactionData.amount}</td></tr>
            <tr><td>Transaction Fee</td><td>${transactionData.fee}</td></tr>
            ${getSpecificFields()}
            <tr><td>Reference ID</td><td>${transactionData.referenceId}</td></tr>
            <tr><td>Status</td><td><span class="status"><span class="status-dot"></span><span class="status-text">${transactionData.status}</span></span></td></tr>
          </table>
        </div>

        <div class="footer">
          <p>© 2025 OMORA. All rights reserved.</p>
          <p>This is a computer-generated receipt and does not require a signature.</p>
        </div>
      </body>
      </html>
    `;
  };

  const downloadPDF = async () => {
    try {
      // Create a new window with the receipt content
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups to download the receipt");
        return;
      }

      // Write the HTML content to the new window
      printWindow.document.write(generatePDFContent());
      printWindow.document.close();

      // Wait for content to load, then trigger print dialog
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Close the window after printing (optional)
          setTimeout(() => {
            printWindow.close();
          }, 1000);
        }, 500);
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating receipt. Please try again.");
    }
  };

  return (
    <button
      onClick={downloadPDF}
      className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors"
    >
      Download PDF receipt
    </button>
  );
}
