import Colors from '@/constants/Colors';
import { FontSizes, Typography } from '@/constants/Typography';
import { useLanguage } from '@/contexts/LanguageContext';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export const LanguageSelector: React.FC = () => {
  const { t, locale, setLocale, locales } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageSelect = (languageCode: string) => {
    setLocale(languageCode as any);
    setModalVisible(false);
  };

  // Get current language name
  const currentLanguage = locales.find(lang => lang.code === locale)?.name || locale;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.languageButtonText}>
          {t('common.language')}: {currentLanguage}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('common.language')}</Text>
            
            <FlatList
              data={locales}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageItem,
                    locale === item.code && styles.selectedLanguageItem,
                  ]}
                  onPress={() => handleLanguageSelect(item.code)}
                >
                  <Text
                    style={[
                      styles.languageItemText,
                      locale === item.code && styles.selectedLanguageText,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {locale === item.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  languageButton: {
    backgroundColor: '#1a0a2b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageButtonText: {
    ...Typography.body.medium,
    fontSize: FontSizes.base,
    color: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.tadado.primary,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.xl,
    color: '#FBAA12',
    marginBottom: 20,
  },
  languageItem: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedLanguageItem: {
    backgroundColor: '#2a0a3b',
  },
  languageItemText: {
    ...Typography.body.medium,
    fontSize: FontSizes.base,
    color: '#ffffff',
  },
  selectedLanguageText: {
    ...Typography.body.semiBold,
    color: '#FBAA12',
  },
  checkmark: {
    color: '#FBAA12',
    fontSize: FontSizes.lg,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#D92151',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.base,
    color: '#ffffff',
  },
});
