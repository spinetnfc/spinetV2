import { getIntl } from '@/lib/intl';

const useTranslate = async (locale: string) => {
  const intl = await getIntl(locale);
  return {
    t: (id: string, second?: any) => {
      return intl.formatMessage({ id: id }, second);
    },
  };
};

export default useTranslate;
