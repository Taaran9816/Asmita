<script>
  // Initialize EmailJS (replace placeholders or get from your setup modal inputs)
  const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // e.g. aBcDeFgHiJkLm
  const SERVICE_ID = 'YOUR_SERVICE_ID';   // from EmailJS dashboard
  const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // from EmailJS template
  emailjs.init(PUBLIC_KEY);

  // Function to submit order via EmailJS
  async function submitOrder() {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const email = document.getElementById('custEmail').value.trim();
    const txnRef = document.getElementById('txnRef').value.trim();
    const items = document.getElementById('payOrderItems').innerText.trim();
    const total = document.getElementById('payOrderTotal').innerText.trim();
    const orderTime = new Date().toLocaleString();

    if (!name || !phone || !address) {
      alert('Please fill in all required fields.');
      return;
    }

    // Show processing step
    document.getElementById('paymentPage').querySelectorAll('div[id^="step"]').forEach(s => s.style.display='none');
    document.getElementById('stepProcessing').style.display='block';

    const templateParams = {
      order_id: 'ORD' + Date.now(),
      customer_name: name,
      customer_phone: phone,
      customer_address: address,
      customer_email: email || 'N/A',
      txn_ref: txnRef || 'N/A',
      order_time: orderTime,
      order_items: items,
      total_amount: total
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
      document.getElementById('stepProcessing').style.display='none';
      document.getElementById('stepSuccess').style.display='block';

      // Optionally fill receipt
      let receipt = '';
      receipt += `<div>Customer: ${name}</div>`;
      receipt += `<div>Phone: ${phone}</div>`;
      receipt += `<div>Address: ${address}</div>`;
      receipt += `<div>Email: ${email || 'N/A'}</div>`;
      receipt += `<div>eSewa Ref: ${txnRef || 'N/A'}</div>`;
      receipt += `<div>Time: ${orderTime}</div>`;
      receipt += `<div style="margin-top:0.5rem;"><strong>Items:</strong><br>${items.replace(/\n/g,'<br>')}</div>`;
      receipt += `<div style="margin-top:0.5rem;"><strong>Total:</strong> ${total}</div>`;
      document.getElementById('receiptContent').innerHTML = receipt;

    } catch (error) {
      console.error('EmailJS error:', error);
      alert('Failed to send order. Please try again or contact store manually.');
      document.getElementById('stepProcessing').style.display='none';
      showStep('Upload'); // go back to upload
    }
  }
</script>
