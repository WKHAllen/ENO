package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"log"
	"os"

	util "eno/src/util"
)

const (
	settingsFile = "settings.json"
	settingsKeyMinLength = 1
	settingsKeyMaxLength = 256
)

// ensureSettingsFileExists will create the settings file if it does not already exist.
func ensureSettingsFileExists() {
	if _, err := os.Stat(settingsFile); errors.Is(err, fs.ErrNotExist) {
		err := os.WriteFile(settingsFile, []byte("{}"), 0755)
		util.CheckError(err)
	}
}

// readSettings reads the settings file into memory.
func readSettings() (map[string]interface{}, error) {
	settingsJson, err := os.ReadFile(settingsFile)
	if err != nil {
		log.Printf("Error occurred reading settings file (%s): %s", settingsFile, err)
		return nil, fmt.Errorf("an unexpected error occurred while getting app settings, check the logs for more details")
	}

	settings := make(map[string]interface{})
	err = json.Unmarshal(settingsJson, &settings)
	if err != nil {
		log.Printf("Error occurred parsing settings file JSON (%s): %s", settingsFile, err)
		return nil, fmt.Errorf("an unexpected error occurred while getting app settings, check the logs for more details")
	}

	return settings, nil
}

// writeSettings writes the settings to the settings file.
func writeSettings(settings map[string]interface{}) error {
	settingsJson, err := json.Marshal(settings)
	if err != nil {
		log.Printf("Error occurred stringifying settings file JSON (%s): %s", settingsFile, err)
		return fmt.Errorf("an unexpected error occurred while saving app settings, check the logs for more details")
	}

	err = os.WriteFile(settingsFile, settingsJson, 0755)
	if err != nil {
		log.Printf("Error occurred writing settings file (%s): %s", settingsFile, err)
		return fmt.Errorf("an unexpected error occurred while saving app settings, check the logs for more details")
	}

	return nil
}

/*
GetSettings gets all settings.

	returns: the settings, or an error.
*/
func GetSettings() (map[string]interface{}, error) {
	settings, err := readSettings()
	if err != nil {
		return nil, err
	}

	return settings, nil
}

/*
GetSettingsOption gets an option from the settings.

	key:     the name of the option to get from settings.

	returns: the option from settings, or an error.
*/
func GetSettingsOption(key string) (interface{}, error) {
	settings, err := readSettings()
	if err != nil {
		return nil, err
	}

	return settings[key], nil
}

/*
SetSettingsOption sets an option in the settings.

	key:     the name of the option.
	value:   the value of the option.

	returns: an error, if one occurs.
*/
func SetSettingsOption(key string, value interface{}) error {
	if len(key) < settingsKeyMinLength || len(key) > settingsKeyMaxLength {
		return fmt.Errorf("settings key must be between %d and %d characters in length", settingsKeyMinLength, settingsKeyMaxLength)
	}

	settings, err := readSettings()
	if err != nil {
		return err
	}

	settings[key] = value

	err = writeSettings(settings)
	if err != nil {
		return err
	}

	return nil
}

/*
DeleteSettingsOption deletes an option from the settings.

	key:     the name of the option.

	returns: an error, if one occurs.
*/
func DeleteSettingsOption(key string) error {
	settings, err := readSettings()
	if err != nil {
		return err
	}

	delete(settings, key)

	err = writeSettings(settings)
	if err != nil {
		return err
	}

	return nil
}
