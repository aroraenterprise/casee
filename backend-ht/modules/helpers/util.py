
"""
Project: nexend
Author: Saj Arora
Description:
"""

import calendar
import hashlib
import re
from uuid import uuid4

from google.appengine.ext import ndb

import errors
from dateutil import parser as dateparser

EMAIL_REGEX = {
    'regex': r'^[-!#$%&\'*+\\.\/0-9=?A-Za-z^_`{|}~]+@([-0-9A-Za-z]+\.)+([0-9A-Za-z]){2,4}$',
    'name': 'email',
    'reverse': False
}

DOMAIN_REGEX = {
    'regex': r"@[\w.]+",
    'name': 'domain',
    'reverse': False
}

ALPHANUM_REGEX = {
    'regex': r'[^a-zA-Z0-9]',
    'name': 'alpha-numeric',
    'reverse': True
}

ALPHA_REGEX = {
    'regex': r'[^a-zA-Z]$',
    'name': 'alpha',
    'reverse': True
}

NUM_REGEX = {
    'regex': r'[^0-9]$',
    'name': 'numeric',
    'reverse': True
}

class Struct:
    def __init__(self, **entries):
        self.__dict__.update(entries)

def constrain_string(string, minlen, maxlen):
    """Validation function constrains minimal and maximal lengths of string.
    Args:
        string (string): String to be checked
        minlen (int): Minimal length
        maxlen (int): Maximal length
    Returns:
        string: Returns given string
    Raises:
        InvalidUsage 400 with payload of min/maxlength
    """

    if len(string) < minlen:
        errors.create(400, {'minlength': minlen}, message='%s is too short' % string)
    elif len(string) > maxlen:
        errors.create(400, {'maxlength': maxlen}, message='%s is too long' % string)
    return string


def constrain_regex(string, regex):
    """Validation function checks validity of string for given regex.
    Args:
        string (string): String to be checked
        regex (object): Regular expression
    Returns:
        string: Returns given string
    Raises:
        InvalidUsage: If string doesn't match regex
    """
    regex_string = re.compile(regex.get('regex'))
    error = False
    if regex.get('reverse') and regex_string.search(string):
        error = True
    elif not regex.get('reverse') and not regex_string.search(string):
        error = True

    if error:
        errors.create(400, {'regex': regex.get('name')}, message='%s is not a %s' % (
            string, regex.get('name')
        ))
    return string

def create_validator(lengths=None, regex='', required=True, return_type=None):
    """This is factory function, which creates validator functions, which
    will then validate passed strings according to lengths or regex set at creation time
    Args:
        lengths (list): list of exact length 2. e.g [3, 7]
            indicates that string should be between 3 and 7 charactes
        regex (string): Regular expression
        required (bool): Wheter empty value '' should be accepted as valid,
            ignoring other constrains
    Returns:
        rule: Function, which will be used for validating input
    """

    def validator_function(value, prop = None):
        """Function validates input against constraints given from closure function
        These functions are primarily used as ndb.Property validators
        Args:
            value (string): input value to be validated
            prop (string): ndb.Property name, which is validated
        Returns:
            string: Returns original string, if valid
        Raises:
            ValueError: If input isn't valid
        """
        # when we compare ndb.Property with equal operator e.g User.name == 'abc' it
        # passes arguments to validator in different order than as when e.g putting data,
        # hence the following parameters switch
        success = True
        result = None
        if isinstance(value, ndb.Property):
            value = prop
        if not required and value == '':
            return return_type('')
        elif required and not value:
            errors.create(400, {'required': value}, 'Missing required field')

        if regex:
            constrain_regex(value, regex)
        if lengths:
            constrain_string(value, lengths[0], lengths[1])
        return return_type(value)

    return validator_function


def password_hash(password, salt):
    """Hashes given plain text password with sha256 encryption
    Hashing is salted with salt configured by admin, stored in >>> model.Config
    Args:
        password (string): Plain text password
    Returns:
        string: hashed password, 64 characters
    """
    sha = hashlib.sha256()
    sha.update(password.encode('utf-8'))
    sha.update(salt)
    return sha.hexdigest()


def uuid(length=None):
    """Generates random UUID used as user token for verification, reseting password etc.
    Returns:
      string: 32 characters long string
    """
    value = uuid4().hex
    length = length if length and len(value) > length > 0 else len(value)
    return value[0:length]


def chunk_array(l, n):
    """Yield successive n-sized chunks from l."""
    for i in xrange(0, len(l), n):
        yield l[i:i+n]

def _convertJsonToString(data, jsonKeys):
        a = []
        for key in jsonKeys:
            a.append(data.get(key))
        return ','.join(a)


def tokenize_autocomplete(phrase):
    """
    Tokenizes a word into its components for autocomplete
    :param phrase:
    :return:
    """
    # replace all (.) with (_)
    phrase = re.sub(r'!+|\.+|,+|-+|@', '_', phrase)

    a = []
    for word in phrase.split():
        j = 1
        while True:
            a.append(word[:j])
            if j == len(word):
                break
            j += 1
    return ','.join(a)

def tokenize_query(q):
    # replace all (.) with (_)
    return str(re.sub(r'!+|\.+|,+|-+|@', '_', q))

def create_no_space_tag(name, replacement='-', lower=False):
    """Function tries to create link from name
    Examples:
      >>> create_no_space_tag('New Project')
      new-project
    Args:
      name (string): Name of Entity
    Returns:
      string: Hopefully a link
    """
    trim = re.sub(r'[^a-zA-Z\d]', ' ', str(name).strip())
    trim = re.sub(' +', ' ', trim.strip())
    result = re.sub(r'[^a-zA-Z\d]', replacement, trim)
    if lower:
        return result.lower()
    return result


def convert_to_dict_if_exists(value):
    if value:
        return dict(value)
    return None


def convert_string_to_timestamp(prop, value):
    """
    Converts a string to timestamp
    :param value:
    :return:
    """
    try:
        temp_datetime = dateparser.parse(value).replace(tzinfo=None)
        return calendar.timegm(temp_datetime.timetuple())
    except:
        return -1


def convert_string_to_datetime(value, tz=None):
    """
    Converts a string to timestamp
    :param value:
    :return:
    """
    try:
        return dateparser.parse(value).replace(tzinfo=tz)
    except:
        return None


def convert_string_to_bool(prop, value):
    if isinstance(value, bool):
        return value
    if isinstance(value, basestring):
        return value.lower() in ['true', '1', True, 1]
    return False


def convert_string_to_int(prop, value):
    if isinstance(value, int):
        return value
    if isinstance(value, basestring):
        return int(value)
    return -1


def verify_email_domain(email, accepted_domains=None, exclusions=None):
    for var in [accepted_domains, exclusions]:
        if not isinstance(var, list):
            var = []
    if email in exclusions:
        return True
    domain = re.search(DOMAIN_REGEX.get('regex'), email)
    if domain.group() and domain.group() in accepted_domains:
        return True
    return False