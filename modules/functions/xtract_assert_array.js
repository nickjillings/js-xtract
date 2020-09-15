export function xtract_assert_array(array) {
    return (typeof array === "object" && array.length !== undefined && array.length > 0);
}
