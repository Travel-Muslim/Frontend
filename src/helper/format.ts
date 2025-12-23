import moment from 'moment';

const formatHelper = {
  // Rupiah
  rupiah: (price?: number) => {
    return price ? `Rp${price.toLocaleString('id-ID')}` : undefined;
  },

  // Periode
  Period: (start?: string, end?: string) => {
    if (start && end) {
      return `${moment(start).format('LL')} - ${moment(end).format('LL')}`;
    }
    if (start) {
      return moment(start).format('LL');
    }
  },
};

export { formatHelper };
