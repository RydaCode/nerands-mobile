import { Picker } from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/constants';

const CategoryPicker = ({ store_category, selectedcategory, handleCategoryChange }) => {
    switch (store_category) {
        case 'Fashion':
            return (
                <Picker
                    selectedValue={selectedcategory}
                    onValueChange={handleCategoryChange}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label={selectedcategory} value='' />
                    <Picker.Item label='Men Shoes' value='Men Shoes' />
                    <Picker.Item label='Men jeans' value='Men jeans' />
                    <Picker.Item label='Men T-shirts' value='Men T-shirts' />
                    <Picker.Item label='Men shirts' value='Men shirts' />
                    <Picker.Item label='Men boxers' value='Men boxers' />
                    <Picker.Item label='Dresses' value='Dresses' />
                    <Picker.Item label='Ladies Tops' value='Ladies Tops' />
                    <Picker.Item label='Ladies Handbags' value='Ladies Handbags' />
                    <Picker.Item label='Ladies Shoes' value='Ladies Shoes' />
                    <Picker.Item label='Ladies night ware' value='Ladies night ware' />
                    <Picker.Item label='Skirts' value='Skirts' />
                    <Picker.Item label='Unisex' value='Unisex' />
                    <Picker.Item label='Sports ware' value='Sports ware' />
                </Picker>
            );
        case 'Restaurant':
            return (
                <Picker
                    selectedValue={selectedcategory}
                    onValueChange={handleCategoryChange}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label='Any' value='Any' />
                    <Picker.Item label='Breakfast' value='Breakfast' />
                    <Picker.Item label='Lunch' value='Lunch' />
                    <Picker.Item label='Supper' value='Supper' />
                    <Picker.Item label='Drinks' value='Drinks' />
                </Picker>
            );
        case 'Electronics':
            return (
                <Picker
                    selectedValue={selectedcategory}
                    onValueChange={handleCategoryChange}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label='Phones' value='Phones' />
                    <Picker.Item label='Sound systems' value='Sound systems' />
                    <Picker.Item label='Tv' value='Tv' />
                </Picker>
            );
        case 'Cosmetics':
            return (
                <Picker
                    selectedValue={selectedcategory}
                    onValueChange={handleCategoryChange}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label='Lotions' value='Lotions' />
                    <Picker.Item label='Bathing soaps' value='Bathing soaps' />
                    <Picker.Item label='Creams' value='Creams' />
                    <Picker.Item label='Nails' value='Nails' />
                </Picker>
            );
        case 'Liquor Store':
            return (
                <Picker
                    selectedValue={selectedcategory}
                    onValueChange={handleCategoryChange}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label='Whisky' value='Whisky' />
                    <Picker.Item label='Wine' value='Wine' />
                    <Picker.Item label='Lager' value='Lager' />
                    <Picker.Item label='Brandy' value='Brandy' />
                    <Picker.Item label='Rum' value='Rum' />
                    <Picker.Item label='Others' value='Others' />
                </Picker>
            );
        case 'Grocery':
            return (
                <Picker
                    selectedValue={selectedcategory}
                    onValueChange={handleCategoryChange}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label='Grocaries' value='Grocaries' />
                </Picker>
            )
        default:
            return <Picker>
                <Picker.Item label='Error' value='' />
        </Picker>
            
    }
};

const styles = StyleSheet.create({
    picker: {
        height: 50,
        borderRadius: 5,
    },
    pickerItem: {
        color: COLORS.slate,
        fontSize: 13,
        fontFamily: 'maven-medium',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily: 'maven-medium'
    },
});

export default CategoryPicker;