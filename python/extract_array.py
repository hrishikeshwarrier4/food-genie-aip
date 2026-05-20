from functions.api import function, Array, Struct

@function
def is_food_null(input_array: Array[Struct[{str: str}]]) -> bool:
    """Check if the food field in the first element of the input array is null or empty.
    
    This function is used in the FoodGenie pipeline to determine whether
    an image has been classified yet (i.e., whether the 'food' field has been
    populated by the LLM image classifier).
    
    Args:
        input_array: Array of structs containing food data
        
    Returns:
        True if array is empty or first item's food value is None/empty
    """
    if not input_array:  # Check if the array is empty
        return True
    first_item = input_array[0]
    food_value = first_item.get('food')
    return food_value is None or food_value == ''
