import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Linking,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faHandshake,
  faChevronRight,
  faLink,
  faExternalLinkAlt,
  faEnvelope,
  faUniversity,
  faFileAlt,
  faUsers,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import staticJsonData from "../../../json/social_service.json"

const { width } = Dimensions.get("window")
const isTablet = width >= 768

export const Social_service = () => {
  const [jsonData, setJsonData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadJsonFromStorage()
  }, [])

  const loadJsonFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem("socialServiceData")
      if (storedData !== null) {
        setJsonData(JSON.parse(storedData))
      } else {
        setJsonData(staticJsonData)
        await AsyncStorage.setItem("socialServiceData", JSON.stringify(staticJsonData))
      }
    } catch (error) {
      console.error("Error loading data from storage:", error)
      setJsonData(staticJsonData)
    }
  }

  const loadJson = async () => {
    setRefreshing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await AsyncStorage.setItem("socialServiceData", JSON.stringify(staticJsonData))
      setJsonData(staticJsonData)
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const RenderTextPart = ({ text }) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi

    if (urlRegex.test(text)) {
      return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(text)} style={styles.linkContainer}>
          <FontAwesomeIcon icon={faLink} size={isTablet ? 16 : 14} color="#0056b3" style={styles.linkIcon} />
          <Text style={styles.linkText}>{text}</Text>
          <FontAwesomeIcon
            icon={faExternalLinkAlt}
            size={isTablet ? 12 : 10}
            color="#0056b3"
            style={styles.externalLinkIcon}
          />
        </TouchableOpacity>
      )
    } else if (emailRegex.test(text)) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => Linking.openURL(`mailto:${text}`)}
          style={styles.linkContainer}
        >
          <FontAwesomeIcon icon={faEnvelope} size={isTablet ? 16 : 14} color="#0056b3" style={styles.linkIcon} />
          <Text style={styles.linkText}>{text}</Text>
        </TouchableOpacity>
      )
    }
    return <Text style={styles.listItemText}>{text}</Text>
  }

  const renderListItem = (text, index) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
    const parts = text.split(new RegExp(`(${urlRegex.source}|${emailRegex.source})`, "gi"))

    return (
      <View key={index} style={styles.listItem}>
        <FontAwesomeIcon icon={faChevronRight} size={isTablet ? 16 : 14} color="#0056b3" style={styles.listItemIcon} />
        <View style={styles.listItemTextContainer}>
          {parts.map((part, i) => (
            <RenderTextPart key={i} text={part} />
          ))}
        </View>
      </View>
    )
  }

  const renderContent = (content) => {
    if (Array.isArray(content)) {
      return content.map((item, index) => renderListItem(item, index))
    } else if (typeof content === "string") {
      return renderListItem(content, 0)
    }
    return null
  }

  const getSectionIcon = (sectionId) => {
    switch (sectionId) {
      case "1":
        return faUniversity
      case "2":
        return faFileAlt
      case "3":
        return faUsers
      default:
        return faInfoCircle
    }
  }

  const renderSection = (sectionId, section) => (
    <View key={sectionId} style={styles.card}>
      <View style={styles.sectionHeader}>
        <FontAwesomeIcon
          icon={getSectionIcon(sectionId)}
          size={isTablet ? 24 : 20}
          color="#0056b3"
          style={styles.sectionIcon}
        />
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {renderContent(section.content)}
        {section["listed-elements"] &&
          Object.entries(section["listed-elements"]).map(([key, element]) =>
            Array.isArray(element)
              ? element.map((subElement, subIndex) => renderListItem(subElement, `${key}-${subIndex}`))
              : renderListItem(element, key),
          )}
        {section["mini-subsections"] &&
          Object.entries(section["mini-subsections"]).map(([subsectionId, subsection]) => (
            <View key={subsectionId} style={styles.miniSubsection}>
              <Text style={styles.miniSubsectionTitle}>{subsection.title}</Text>
              {renderContent(subsection.content)}
              {subsection["listed-elements"] &&
                Object.entries(subsection["listed-elements"]).map(([key, element]) =>
                  Array.isArray(element)
                    ? element.map((subElement, subIndex) =>
                        renderListItem(subElement, `${subsectionId}-${key}-${subIndex}`),
                      )
                    : renderListItem(element, `${subsectionId}-${key}`),
                )}
            </View>
          ))}
        {section.links &&
          Object.entries(section.links).map(([linkId, linkData]) => (
            <TouchableOpacity
              key={linkId}
              style={styles.linkContainer}
              activeOpacity={0.7}
              onPress={() => Linking.openURL(linkData.url)}
            >
              <FontAwesomeIcon icon={faLink} size={isTablet ? 20 : 16} color="#0056b3" style={styles.linkIcon} />
              <Text style={styles.linkText}>{linkData.text}</Text>
              <FontAwesomeIcon
                icon={faExternalLinkAlt}
                size={isTablet ? 16 : 12}
                color="#0056b3"
                style={styles.externalLinkIcon}
              />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  )

  if (!jsonData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadJson} />}
      >
        <LinearGradient
          colors={["#0056b3", "#007bff"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <FontAwesomeIcon icon={faHandshake} size={isTablet ? 32 : 24} color="#fff" />
          <Text style={styles.headerTitle}>{jsonData.section_description.name}</Text>
        </LinearGradient>
        {Object.entries(jsonData.section_description["sub-sections"]).map(([sectionId, section]) =>
          renderSection(sectionId, section),
        )}
        <TouchableOpacity
          style={styles.contactButton}
          activeOpacity={0.7}
          onPress={() => Linking.openURL("mailto:ussocial@cucei.udg.mx")}
        >
          <FontAwesomeIcon icon={faEnvelope} size={isTablet ? 24 : 20} color="#fff" />
          <Text style={styles.contactButtonText}>Contactar Servicio Social</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: isTablet ? 20 : 16,
    color: "#0056b3",
    marginTop: 10,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: isTablet ? 30 : 20,
    borderBottomLeftRadius: isTablet ? 30 : 20,
    borderBottomRightRadius: isTablet ? 30 : 20,
  },
  headerTitle: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: isTablet ? 15 : 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: isTablet ? 24 : 16,
    marginVertical: isTablet ? 15 : 10,
    borderRadius: isTablet ? 16 : 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: isTablet ? 20 : 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  sectionIcon: {
    marginRight: isTablet ? 15 : 10,
  },
  sectionTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "bold",
    color: "#0056b3",
    flex: 1,
  },
  sectionContent: {
    padding: isTablet ? 20 : 15,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: isTablet ? 15 : 10,
  },
  listItemIcon: {
    marginTop: isTablet ? 6 : 4,
    marginRight: isTablet ? 15 : 10,
  },
  listItemTextContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  listItemText: {
    fontSize: isTablet ? 18 : 16,
    color: "#333",
    lineHeight: isTablet ? 28 : 24,
  },
  miniSubsection: {
    marginTop: isTablet ? 20 : 15,
    marginLeft: isTablet ? 20 : 15,
  },
  miniSubsectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: "bold",
    color: "#0056b3",
    marginBottom: isTablet ? 15 : 10,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e1e8ed",
    padding: isTablet ? 15 : 10,
    borderRadius: isTablet ? 12 : 8,
    marginTop: isTablet ? 15 : 10,
  },
  linkIcon: {
    marginRight: isTablet ? 15 : 10,
  },
  linkText: {
    fontSize: isTablet ? 18 : 16,
    color: "#0056b3",
    textDecorationLine: "underline",
    flex: 1,
  },
  externalLinkIcon: {
    marginLeft: isTablet ? 10 : 5,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0056b3",
    padding: isTablet ? 20 : 15,
    borderRadius: isTablet ? 12 : 8,
    marginHorizontal: isTablet ? 24 : 16,
    marginTop: isTablet ? 30 : 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  contactButtonText: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: isTablet ? 15 : 10,
  },
})

export default Social_service

