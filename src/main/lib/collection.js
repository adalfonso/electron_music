// Must take an array of objects
class Collection {

    constructor(data = []) {
		if (data instanceof Collection) {
			data = data.originalData;
		}

		if (typeof data === 'object' && !Array.isArray(data)) {
			let tempData = [];

			for (let item in data) {
				tempData.push(data[item]);
			}

			data = tempData;
		}

        this.data = data;
		this.originalData = data;
        this.groupedBy = null;
    }

	clone(indexOrObject) {
		let source;
		let clone = {};

		if (typeof indexOrObject === 'number'
		 || typeof indexOrObject === 'string') {
			source = this.data[indexOrObject];

		} else if (typeof indexOrObject === 'object') {
			source = indexOrObject;
		}

		if (Array.isArray(source)) {
			clone = [];
		}

		for (let property in source) {
			if (source[property] === null) {
				clone[property] = null;

			} else if (typeof source[property] === 'object') {
				clone[property] = this.clone(source[property]);

			} else {
				clone[property] = source[property];
			}
		}

		return clone;
	}

	collapse(data = null, destruct = false) {
        var store = [];

		// Explicitly collapse some data
        if (data !== null) {
            data.forEach(item => {
                if (Array.isArray(item)) {
                    return store = store.concat(this.collapse(item, true));
                }

                if (typeof item === 'object') {
                    store.push(item);
                }
            });
            return store;
        }

		this.each(item => {
			if (Array.isArray(item)) {
                return store = store.concat(this.collapse(item, true));
            }

            if (typeof item === 'object') {
				for (let piece in item) {
					store.push(item[piece]);
				}
            }
		});

		if (destruct) {
			this.data = store;
			this.groupedBy = null;
	        return this;
		}

        return new Collection(store);
    }

    count() {
		return this.data instanceof Object ?
			Object.keys(this.data).length :
			this.data.length;
    }

	countAll(){
		return this.originalData.length;
	}

    first() {
        return this.data[0];
    }

	has(item) {
		return this.data.indexOf(item) !== -1;
	}

    last() {
        return this.data[this.data.length - 1];
    }

    each(func) {
		if (Array.isArray(this.data)) {
			this.data.forEach((item, index, array) => {
	            func(item, index, array);
	        });

		} else {
			for (let key in this.data) {
				func(this.data[key], key);
			}
		}

        return this;
    }

	forget(index) {
		this.data.splice(index, 1);
	}

    filter(func) {
        return new Collection (
			this.data.filter((item, index, array) => {
	            return func(item, index, array);
	        })
		);
    }

	find(id) {
		return this.where('id', id).first();
	}

	insert(item, index = this.data.length - 1) {
		this.data.splice(index, 0, item);
		return this;
	}

	isEmpty() {
		return this.count() === 0;
	}

	isNotEmpty() {
		return ! this.isEmpty();
	}

	isGrouped() {
		return this.groupedBy !== null;
	}

	join(delimiter) {
		return this.data.join(delimiter);
	}

    groupBy(property) {
		if (this.groupedBy === property) {
			return;
		}

		if (this.isGrouped()) {
			this.collapse(null, true);
		}

        let data = {};
		let isFunction = typeof property === 'function';

        this.each(item => {
            let index = isFunction
				? property(item)
				: item[property];

            if (data[index] === undefined) {
                data[index] = [];
            }

            data[index].push(item);
			data[index]._grouped = true;
        });

        this.groupedBy = property;
        this.data = data;

        return this;
    }

    map(func) {
        if (Array.isArray(this.data)) {
			return new Collection (
				this.data.map((item, index, array) => {
					return func(item, index, array);
				})
			);
		}

		let newCollect = new Collection();

		for (let prop in this.data) {
			newCollect.push(func(this.data[prop], prop, this.data));
		}

		return newCollect;
    }

	merge(data) {
		if (data instanceof Collection) {
			data = data.data;
		}

		return new Collection(this.data.concat(data));
	}

	offset(amount) {
		if (amount === 0) {
			return this;
		}

		return new Collection(
			this.data.slice(amount, this.data.length)
		);
	}

	prepend(item) {
		this.data.unshift(item);

		return this;
	}

	pluck(property) {
		return this.map(item => {
			let layers = property.split('.');

			layers.forEach(layer => {
				item = item[layer];
			});

			return item;
		});
	}

	push(item) {
		this.data.push(item);
		return this;
	}

    reduce(func, startValue = 0, index) {
        return this.data.reduce((carry, value, index) => {
            return func(carry, value, index);
        }, startValue);
    }

	refresh() {
		let data = this.data;
		this.data = null;
		this.data = data;
	}

	reset() {
		this.data = this.originalData;
	}

	reverse() {
		return new Collection(this.data.reverse());
	}

	sort() {
		return new Collection(
			this.data.sort((a, b) => {
				return this.localeSort(a, b);
			})
		);
	}

	sortBy(propertyOrFunction = null) {
		if (propertyOrFunction === null) {
			return this.sort();
		}

		if (typeof propertyOrFunction === 'string') {
			let property = propertyOrFunction;

			return new Collection(
				this.data.sort((a, b) => {
					return this.localeSort(a[property], b[property]);
				})
			);
		}

		let closure = propertyOrFunction;

		return new Collection(
			this.data.sort((a, b) => {
				return this.localeSort(closure(a), closure(b));
			})
		);
	}

	localeSort(a, b) {
		let settings = { numeric: true, sensitivity: 'base' };

		return this.cleanLocale(a).localeCompare(
			this.cleanLocale(b), undefined, settings
		);
	}

	cleanLocale(input) {
		return (input === null || input === undefined) ? '' : input.toString();
	}

	sortByDesc(propertyOrFunction = null) {
		return this.sortBy(propertyOrFunction).reverse();
	}

	sum(property = null) {
		if (!property) {
			return this.reduce((carry, item) => carry + item);
		}

		return this.reduce((carry, item) => {
			return !item[property] === ''
				? carry : carry + parseFloat(item[property]);
		});
	}

	take(amount) {
		return new Collection(this.data.slice(0, amount));
	}

	unique(property = null) {
		let exists = [];

		return this.filter(item => {
			let value = property === null ? item : item[property];

			if (exists.indexOf(value) !== -1) {
				return false;
			}

			exists.push(value);

			return true;
		})
	}

    where(property, comparisionOrValue, value = undefined, strict = false) {
		if (property instanceof Object) {
			return this.whereMultiple(property);
		}

        var comparison;

        if (value === undefined) {
            value = comparisionOrValue;
            comparison = '=';
        } else {
            comparison = comparisionOrValue;
        }

        return new Collection (
			this.filter( item => {
	            if (comparison === '=')  {
					return strict ? item[property] === value : item[property] == value;
				}
	            if (comparison === '!=') {
					return strict ? item[property] !== value : item[property] != value;
				}
	            if (comparison === '>')  { return item[property] >  value; }
	            if (comparison === '<')  { return item[property] <  value; }
	            if (comparison === '>=') { return item[property] >= value; }
	            if (comparison === '<=') { return item[property] <= value; }
	            return item[property] === value;
	        })
		);
    }

	whereStrict(property, comparisionOrValue, value = null) {
		return this.where(property, comparisionOrValue, value, true);
	}

	whereIn(property, values = []) {
		return this.filter(item => {
			return values.indexOf(item[property]) !== -1;
		});
	}

	whereNotIn(property, values = []) {
		return this.filter(item => {
			return values.indexOf(item[property]) === -1;
		});
	}

	whereMultiple(properties) {
		let collection = new Collection(this.data);

		for (let property in properties) {
			collection = collection.where(property, properties[property]);
		}

		return collection;
	}

	use() {
		return this.data;
	}
}

export default Collection;
