export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };
  
  export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  export const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return `${formatDate(dateString)} ${formatTime(dateString)}`;
  };
  
  export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
  };
  
  export const formatPercentage = (value) => {
    if (typeof value !== 'number') return '0%';
    return `${(value * 100).toFixed(1)}%`;
  };
  
  export const capitalize = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  
  export const truncate = (string, length = 50) => {
    if (!string) return '';
    if (string.length <= length) return string;
    return string.slice(0, length) + '...';
  };