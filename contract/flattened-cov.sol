

// Sources flattened with hardhat v2.20.1 https://hardhat.org

// SPDX-License-Identifier: MIT

// File @openzeppelin/contracts/utils/Context.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


// File @openzeppelin/contracts/access/Ownable.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


// File @openzeppelin/contracts/interfaces/draft-IERC6093.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (interfaces/draft-IERC6093.sol)

/**
 * @dev Standard ERC20 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC20 tokens.
 */
interface IERC20Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC20InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC20InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `spender`ÔÇÖs `allowance`. Used in transfers.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     * @param allowance Amount of tokens a `spender` is allowed to operate with.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC20InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `spender` to be approved. Used in approvals.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC20InvalidSpender(address spender);
}

/**
 * @dev Standard ERC721 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC721 tokens.
 */
interface IERC721Errors {
    /**
     * @dev Indicates that an address can't be an owner. For example, `address(0)` is a forbidden owner in EIP-20.
     * Used in balance queries.
     * @param owner Address of the current owner of a token.
     */
    error ERC721InvalidOwner(address owner);

    /**
     * @dev Indicates a `tokenId` whose `owner` is the zero address.
     * @param tokenId Identifier number of a token.
     */
    error ERC721NonexistentToken(uint256 tokenId);

    /**
     * @dev Indicates an error related to the ownership over a particular token. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param tokenId Identifier number of a token.
     * @param owner Address of the current owner of a token.
     */
    error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC721InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC721InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`ÔÇÖs approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param tokenId Identifier number of a token.
     */
    error ERC721InsufficientApproval(address operator, uint256 tokenId);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC721InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC721InvalidOperator(address operator);
}

/**
 * @dev Standard ERC1155 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC1155 tokens.
 */
interface IERC1155Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     * @param tokenId Identifier number of a token.
     */
    error ERC1155InsufficientBalance(address sender, uint256 balance, uint256 needed, uint256 tokenId);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC1155InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC1155InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`ÔÇÖs approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param owner Address of the current owner of a token.
     */
    error ERC1155MissingApprovalForAll(address operator, address owner);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC1155InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC1155InvalidOperator(address operator);

    /**
     * @dev Indicates an array length mismatch between ids and values in a safeBatchTransferFrom operation.
     * Used in batch transfers.
     * @param idsLength Length of the array of token identifiers
     * @param valuesLength Length of the array of token amounts
     */
    error ERC1155InvalidArrayLength(uint256 idsLength, uint256 valuesLength);
}


// File @openzeppelin/contracts/utils/introspection/IERC165.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/introspection/IERC165.sol)

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}


// File @openzeppelin/contracts/token/ERC721/IERC721.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/IERC721.sol)

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721 is IERC165 {
    /**
     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon
     *   a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must have been allowed to move this token by either {approve} or
     *   {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon
     *   a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Note that the caller is responsible to confirm that the recipient is capable of receiving ERC721
     * or else they may be permanently lost. Usage of {safeTransferFrom} prevents loss, though the caller must
     * understand this adds an external call which potentially creates a reentrancy vulnerability.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The `operator` cannot be the address zero.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool approved) external;

    /**
     * @dev Returns the account approved for `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}


// File @openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/extensions/IERC721Metadata.sol)

/**
 * @title ERC-721 Non-Fungible Token Standard, optional metadata extension
 * @dev See https://eips.ethereum.org/EIPS/eip-721
 */
interface IERC721Metadata is IERC721 {
    /**
     * @dev Returns the token collection name.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the token collection symbol.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
     */
    function tokenURI(uint256 tokenId) external view returns (string memory);
}


// File @openzeppelin/contracts/token/ERC721/IERC721Receiver.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/IERC721Receiver.sol)

/**
 * @title ERC721 token receiver interface
 * @dev Interface for any contract that wants to support safeTransfers
 * from ERC721 asset contracts.
 */
interface IERC721Receiver {
    /**
     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}
     * by `operator` from `from`, this function is called.
     *
     * It must return its Solidity selector to confirm the token transfer.
     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be
     * reverted.
     *
     * The selector can be obtained in Solidity with `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}


// File @openzeppelin/contracts/utils/introspection/ERC165.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/introspection/ERC165.sol)

/**
 * @dev Implementation of the {IERC165} interface.
 *
 * Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
 * for the additional interface id that will be supported. For example:
 *
 * ```solidity
 * function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
 *     return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
 * }
 * ```
 */
abstract contract ERC165 is IERC165 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}


// File @openzeppelin/contracts/utils/math/Math.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/math/Math.sol)

/**
 * @dev Standard math utilities missing in the Solidity language.
 */
library Math {
    /**
     * @dev Muldiv operation overflow.
     */
    error MathOverflowedMulDiv();

    enum Rounding {
        Floor, // Toward negative infinity
        Ceil, // Toward positive infinity
        Trunc, // Toward zero
        Expand // Away from zero
    }

    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, with an overflow flag.
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow.
        return (a & b) + (a ^ b) / 2;
    }

    /**
     * @dev Returns the ceiling of the division of two numbers.
     *
     * This differs from standard division with `/` in that it rounds towards infinity instead
     * of rounding towards zero.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        if (b == 0) {
            // Guarantee the same behavior as in a regular Solidity division.
            return a / b;
        }

        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /**
     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or
     * denominator == 0.
     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv) with further edits by
     * Uniswap Labs also under MIT license.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
        unchecked {
            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
            // variables such that product = prod1 * 2^256 + prod0.
            uint256 prod0 = x * y; // Least significant 256 bits of the product
            uint256 prod1; // Most significant 256 bits of the product
            assembly {
                let mm := mulmod(x, y, not(0))
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }

            // Handle non-overflow cases, 256 by 256 division.
            if (prod1 == 0) {
                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
                // The surrounding unchecked block does not change this fact.
                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
                return prod0 / denominator;
            }

            // Make sure the result is less than 2^256. Also prevents denominator == 0.
            if (denominator <= prod1) {
                revert MathOverflowedMulDiv();
            }

            ///////////////////////////////////////////////
            // 512 by 256 division.
            ///////////////////////////////////////////////

            // Make division exact by subtracting the remainder from [prod1 prod0].
            uint256 remainder;
            assembly {
                // Compute remainder using mulmod.
                remainder := mulmod(x, y, denominator)

                // Subtract 256 bit number from 512 bit number.
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }

            // Factor powers of two out of denominator and compute largest power of two divisor of denominator.
            // Always >= 1. See https://cs.stackexchange.com/q/138556/92363.

            uint256 twos = denominator & (0 - denominator);
            assembly {
                // Divide denominator by twos.
                denominator := div(denominator, twos)

                // Divide [prod1 prod0] by twos.
                prod0 := div(prod0, twos)

                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
                twos := add(div(sub(0, twos), twos), 1)
            }

            // Shift in bits from prod1 into prod0.
            prod0 |= prod1 * twos;

            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
            // four bits. That is, denominator * inv = 1 mod 2^4.
            uint256 inverse = (3 * denominator) ^ 2;

            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also
            // works in modular arithmetic, doubling the correct bits in each step.
            inverse *= 2 - denominator * inverse; // inverse mod 2^8
            inverse *= 2 - denominator * inverse; // inverse mod 2^16
            inverse *= 2 - denominator * inverse; // inverse mod 2^32
            inverse *= 2 - denominator * inverse; // inverse mod 2^64
            inverse *= 2 - denominator * inverse; // inverse mod 2^128
            inverse *= 2 - denominator * inverse; // inverse mod 2^256

            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
            // is no longer required.
            result = prod0 * inverse;
            return result;
        }
    }

    /**
     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
        uint256 result = mulDiv(x, y, denominator);
        if (unsignedRoundsUp(rounding) && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    /**
     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded
     * towards zero.
     *
     * Inspired by Henry S. Warren, Jr.'s "Hacker's Delight" (Chapter 11).
     */
    function sqrt(uint256 a) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
        //
        // We know that the "msb" (most significant bit) of our target number `a` is a power of 2 such that we have
        // `msb(a) <= a < 2*msb(a)`. This value can be written `msb(a)=2**k` with `k=log2(a)`.
        //
        // This can be rewritten `2**log2(a) <= a < 2**(log2(a) + 1)`
        // ÔåÆ `sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))`
        // ÔåÆ `2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)`
        //
        // Consequently, `2**(log2(a) / 2)` is a good first approximation of `sqrt(a)` with at least 1 correct bit.
        uint256 result = 1 << (log2(a) >> 1);

        // At this point `result` is an estimation with one bit of precision. We know the true value is a uint128,
        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
        // into the expected uint128 result.
        unchecked {
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            return min(result, a / result);
        }
    }

    /**
     * @notice Calculates sqrt(a), following the selected rounding direction.
     */
    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = sqrt(a);
            return result + (unsignedRoundsUp(rounding) && result * result < a ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 2 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     */
    function log2(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 128;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 64;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 32;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 16;
            }
            if (value >> 8 > 0) {
                value >>= 8;
                result += 8;
            }
            if (value >> 4 > 0) {
                value >>= 4;
                result += 4;
            }
            if (value >> 2 > 0) {
                value >>= 2;
                result += 2;
            }
            if (value >> 1 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log2(value);
            return result + (unsignedRoundsUp(rounding) && 1 << result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 10 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     */
    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log10(value);
            return result + (unsignedRoundsUp(rounding) && 10 ** result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 256 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     *
     * Adding one to the result gives the number of pairs of hex symbols needed to represent `value` as a hex string.
     */
    function log256(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 16;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 8;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 4;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 2;
            }
            if (value >> 8 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log256(value);
            return result + (unsignedRoundsUp(rounding) && 1 << (result << 3) < value ? 1 : 0);
        }
    }

    /**
     * @dev Returns whether a provided rounding mode is considered rounding up for unsigned integers.
     */
    function unsignedRoundsUp(Rounding rounding) internal pure returns (bool) {
        return uint8(rounding) % 2 == 1;
    }
}


// File @openzeppelin/contracts/utils/math/SignedMath.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/math/SignedMath.sol)

/**
 * @dev Standard signed math utilities missing in the Solidity language.
 */
library SignedMath {
    /**
     * @dev Returns the largest of two signed numbers.
     */
    function max(int256 a, int256 b) internal pure returns (int256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two signed numbers.
     */
    function min(int256 a, int256 b) internal pure returns (int256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two signed numbers without overflow.
     * The result is rounded towards zero.
     */
    function average(int256 a, int256 b) internal pure returns (int256) {
        // Formula from the book "Hacker's Delight"
        int256 x = (a & b) + ((a ^ b) >> 1);
        return x + (int256(uint256(x) >> 255) & (a ^ b));
    }

    /**
     * @dev Returns the absolute unsigned value of a signed value.
     */
    function abs(int256 n) internal pure returns (uint256) {
        unchecked {
            // must be unchecked in order to support `n = type(int256).min`
            return uint256(n >= 0 ? n : -n);
        }
    }
}


// File @openzeppelin/contracts/utils/Strings.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/Strings.sol)


/**
 * @dev String operations.
 */
library Strings {
    bytes16 private constant HEX_DIGITS = "0123456789abcdef";
    uint8 private constant ADDRESS_LENGTH = 20;

    /**
     * @dev The `value` string doesn't fit in the specified `length`.
     */
    error StringsInsufficientHexLength(uint256 value, uint256 length);

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        unchecked {
            uint256 length = Math.log10(value) + 1;
            string memory buffer = new string(length);
            uint256 ptr;
            /// @solidity memory-safe-assembly
            assembly {
                ptr := add(buffer, add(32, length))
            }
            while (true) {
                ptr--;
                /// @solidity memory-safe-assembly
                assembly {
                    mstore8(ptr, byte(mod(value, 10), HEX_DIGITS))
                }
                value /= 10;
                if (value == 0) break;
            }
            return buffer;
        }
    }

    /**
     * @dev Converts a `int256` to its ASCII `string` decimal representation.
     */
    function toStringSigned(int256 value) internal pure returns (string memory) {
        return string.concat(value < 0 ? "-" : "", toString(SignedMath.abs(value)));
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation.
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        unchecked {
            return toHexString(value, Math.log256(value) + 1);
        }
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        uint256 localValue = value;
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = HEX_DIGITS[localValue & 0xf];
            localValue >>= 4;
        }
        if (localValue != 0) {
            revert StringsInsufficientHexLength(value, length);
        }
        return string(buffer);
    }

    /**
     * @dev Converts an `address` with fixed length of 20 bytes to its not checksummed ASCII `string` hexadecimal
     * representation.
     */
    function toHexString(address addr) internal pure returns (string memory) {
        return toHexString(uint256(uint160(addr)), ADDRESS_LENGTH);
    }

    /**
     * @dev Returns true if the two strings are equal.
     */
    function equal(string memory a, string memory b) internal pure returns (bool) {
        return bytes(a).length == bytes(b).length && keccak256(bytes(a)) == keccak256(bytes(b));
    }
}


// File @openzeppelin/contracts/token/ERC721/ERC721.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/ERC721.sol)



/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */
abstract contract ERC721 is Context, ERC165, IERC721, IERC721Metadata, IERC721Errors {
    using Strings for uint256;

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    mapping(uint256 tokenId => address) private _owners;

    mapping(address owner => uint256) private _balances;

    mapping(uint256 tokenId => address) private _tokenApprovals;

    mapping(address owner => mapping(address operator => bool)) private _operatorApprovals;

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner) public view virtual returns (uint256) {
        if (owner == address(0)) {
            revert ERC721InvalidOwner(address(0));
        }
        return _balances[owner];
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) public view virtual returns (address) {
        return _requireOwned(tokenId);
    }

    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual returns (string memory) {
        _requireOwned(tokenId);

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string.concat(baseURI, tokenId.toString()) : "";
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) public virtual {
        _approve(to, tokenId, _msgSender());
    }

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256 tokenId) public view virtual returns (address) {
        _requireOwned(tokenId);

        return _getApproved(tokenId);
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) public virtual {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(address owner, address operator) public view virtual returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(address from, address to, uint256 tokenId) public virtual {
        if (to == address(0)) {
            revert ERC721InvalidReceiver(address(0));
        }
        // Setting an "auth" arguments enables the `_isAuthorized` check which verifies that the token exists
        // (from != 0). Therefore, it is not needed to verify that the return value is not 0 here.
        address previousOwner = _update(to, tokenId, _msgSender());
        if (previousOwner != from) {
            revert ERC721IncorrectOwner(from, tokenId, previousOwner);
        }
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual {
        transferFrom(from, to, tokenId);
        _checkOnERC721Received(from, to, tokenId, data);
    }

    /**
     * @dev Returns the owner of the `tokenId`. Does NOT revert if token doesn't exist
     *
     * IMPORTANT: Any overrides to this function that add ownership of tokens not tracked by the
     * core ERC721 logic MUST be matched with the use of {_increaseBalance} to keep balances
     * consistent with ownership. The invariant to preserve is that for any address `a` the value returned by
     * `balanceOf(a)` must be equal to the number of tokens such that `_ownerOf(tokenId)` is `a`.
     */
    function _ownerOf(uint256 tokenId) internal view virtual returns (address) {
        return _owners[tokenId];
    }

    /**
     * @dev Returns the approved address for `tokenId`. Returns 0 if `tokenId` is not minted.
     */
    function _getApproved(uint256 tokenId) internal view virtual returns (address) {
        return _tokenApprovals[tokenId];
    }

    /**
     * @dev Returns whether `spender` is allowed to manage `owner`'s tokens, or `tokenId` in
     * particular (ignoring whether it is owned by `owner`).
     *
     * WARNING: This function assumes that `owner` is the actual owner of `tokenId` and does not verify this
     * assumption.
     */
    function _isAuthorized(address owner, address spender, uint256 tokenId) internal view virtual returns (bool) {
        return
            spender != address(0) &&
            (owner == spender || isApprovedForAll(owner, spender) || _getApproved(tokenId) == spender);
    }

    /**
     * @dev Checks if `spender` can operate on `tokenId`, assuming the provided `owner` is the actual owner.
     * Reverts if `spender` does not have approval from the provided `owner` for the given token or for all its assets
     * the `spender` for the specific `tokenId`.
     *
     * WARNING: This function assumes that `owner` is the actual owner of `tokenId` and does not verify this
     * assumption.
     */
    function _checkAuthorized(address owner, address spender, uint256 tokenId) internal view virtual {
        if (!_isAuthorized(owner, spender, tokenId)) {
            if (owner == address(0)) {
                revert ERC721NonexistentToken(tokenId);
            } else {
                revert ERC721InsufficientApproval(spender, tokenId);
            }
        }
    }

    /**
     * @dev Unsafe write access to the balances, used by extensions that "mint" tokens using an {ownerOf} override.
     *
     * NOTE: the value is limited to type(uint128).max. This protect against _balance overflow. It is unrealistic that
     * a uint256 would ever overflow from increments when these increments are bounded to uint128 values.
     *
     * WARNING: Increasing an account's balance using this function tends to be paired with an override of the
     * {_ownerOf} function to resolve the ownership of the corresponding tokens so that balances and ownership
     * remain consistent with one another.
     */
    function _increaseBalance(address account, uint128 value) internal virtual {
        unchecked {
            _balances[account] += value;
        }
    }

    /**
     * @dev Transfers `tokenId` from its current owner to `to`, or alternatively mints (or burns) if the current owner
     * (or `to`) is the zero address. Returns the owner of the `tokenId` before the update.
     *
     * The `auth` argument is optional. If the value passed is non 0, then this function will check that
     * `auth` is either the owner of the token, or approved to operate on the token (by the owner).
     *
     * Emits a {Transfer} event.
     *
     * NOTE: If overriding this function in a way that tracks balances, see also {_increaseBalance}.
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual returns (address) {
        address from = _ownerOf(tokenId);

        // Perform (optional) operator check
        if (auth != address(0)) {
            _checkAuthorized(from, auth, tokenId);
        }

        // Execute the update
        if (from != address(0)) {
            // Clear approval. No need to re-authorize or emit the Approval event
            _approve(address(0), tokenId, address(0), false);

            unchecked {
                _balances[from] -= 1;
            }
        }

        if (to != address(0)) {
            unchecked {
                _balances[to] += 1;
            }
        }

        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);

        return from;
    }

    /**
     * @dev Mints `tokenId` and transfers it to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(address to, uint256 tokenId) internal {
        if (to == address(0)) {
            revert ERC721InvalidReceiver(address(0));
        }
        address previousOwner = _update(to, tokenId, address(0));
        if (previousOwner != address(0)) {
            revert ERC721InvalidSender(address(0));
        }
    }

    /**
     * @dev Mints `tokenId`, transfers it to `to` and checks for `to` acceptance.
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeMint(address to, uint256 tokenId) internal {
        _safeMint(to, tokenId, "");
    }

    /**
     * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
     */
    function _safeMint(address to, uint256 tokenId, bytes memory data) internal virtual {
        _mint(to, tokenId);
        _checkOnERC721Received(address(0), to, tokenId, data);
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     * This is an internal function that does not check if the sender is authorized to operate on the token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal {
        address previousOwner = _update(address(0), tokenId, address(0));
        if (previousOwner == address(0)) {
            revert ERC721NonexistentToken(tokenId);
        }
    }

    /**
     * @dev Transfers `tokenId` from `from` to `to`.
     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     *
     * Emits a {Transfer} event.
     */
    function _transfer(address from, address to, uint256 tokenId) internal {
        if (to == address(0)) {
            revert ERC721InvalidReceiver(address(0));
        }
        address previousOwner = _update(to, tokenId, address(0));
        if (previousOwner == address(0)) {
            revert ERC721NonexistentToken(tokenId);
        } else if (previousOwner != from) {
            revert ERC721IncorrectOwner(from, tokenId, previousOwner);
        }
    }

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking that contract recipients
     * are aware of the ERC721 standard to prevent tokens from being forever locked.
     *
     * `data` is additional data, it has no specified format and it is sent in call to `to`.
     *
     * This internal function is like {safeTransferFrom} in the sense that it invokes
     * {IERC721Receiver-onERC721Received} on the receiver, and can be used to e.g.
     * implement alternative mechanisms to perform token transfer, such as signature-based.
     *
     * Requirements:
     *
     * - `tokenId` token must exist and be owned by `from`.
     * - `to` cannot be the zero address.
     * - `from` cannot be the zero address.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeTransfer(address from, address to, uint256 tokenId) internal {
        _safeTransfer(from, to, tokenId, "");
    }

    /**
     * @dev Same as {xref-ERC721-_safeTransfer-address-address-uint256-}[`_safeTransfer`], with an additional `data` parameter which is
     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
     */
    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory data) internal virtual {
        _transfer(from, to, tokenId);
        _checkOnERC721Received(from, to, tokenId, data);
    }

    /**
     * @dev Approve `to` to operate on `tokenId`
     *
     * The `auth` argument is optional. If the value passed is non 0, then this function will check that `auth` is
     * either the owner of the token, or approved to operate on all tokens held by this owner.
     *
     * Emits an {Approval} event.
     *
     * Overrides to this logic should be done to the variant with an additional `bool emitEvent` argument.
     */
    function _approve(address to, uint256 tokenId, address auth) internal {
        _approve(to, tokenId, auth, true);
    }

    /**
     * @dev Variant of `_approve` with an optional flag to enable or disable the {Approval} event. The event is not
     * emitted in the context of transfers.
     */
    function _approve(address to, uint256 tokenId, address auth, bool emitEvent) internal virtual {
        // Avoid reading the owner unless necessary
        if (emitEvent || auth != address(0)) {
            address owner = _requireOwned(tokenId);

            // We do not use _isAuthorized because single-token approvals should not be able to call approve
            if (auth != address(0) && owner != auth && !isApprovedForAll(owner, auth)) {
                revert ERC721InvalidApprover(auth);
            }

            if (emitEvent) {
                emit Approval(owner, to, tokenId);
            }
        }

        _tokenApprovals[tokenId] = to;
    }

    /**
     * @dev Approve `operator` to operate on all of `owner` tokens
     *
     * Requirements:
     * - operator can't be the address zero.
     *
     * Emits an {ApprovalForAll} event.
     */
    function _setApprovalForAll(address owner, address operator, bool approved) internal virtual {
        if (operator == address(0)) {
            revert ERC721InvalidOperator(operator);
        }
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    /**
     * @dev Reverts if the `tokenId` doesn't have a current owner (it hasn't been minted, or it has been burned).
     * Returns the owner.
     *
     * Overrides to ownership logic should be done to {_ownerOf}.
     */
    function _requireOwned(uint256 tokenId) internal view returns (address) {
        address owner = _ownerOf(tokenId);
        if (owner == address(0)) {
            revert ERC721NonexistentToken(tokenId);
        }
        return owner;
    }

    /**
     * @dev Private function to invoke {IERC721Receiver-onERC721Received} on a target address. This will revert if the
     * recipient doesn't accept the token transfer. The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param data bytes optional data to send along with the call
     */
    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory data) private {
        if (to.code.length > 0) {
            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {
                if (retval != IERC721Receiver.onERC721Received.selector) {
                    revert ERC721InvalidReceiver(to);
                }
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert ERC721InvalidReceiver(to);
                } else {
                    /// @solidity memory-safe-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        }
    }
}


// File @openzeppelin/contracts/utils/Base64.sol@v5.0.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/Base64.sol)


/**
 * @dev Provides a set of functions to operate with Base64 strings.
 */
library Base64 {
    /**
     * @dev Base64 Encoding/Decoding Table
     */
    string internal constant _TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /**
     * @dev Converts a `bytes` to its Bytes64 `string` representation.
     */
    function encode(bytes memory data) internal pure returns (string memory) {
        /**
         * Inspired by Brecht Devos (Brechtpd) implementation - MIT licence
         * https://github.com/Brechtpd/base64/blob/e78d9fd951e7b0977ddca77d92dc85183770daf4/base64.sol
         */
        if (data.length == 0) return "";

        // Loads the table into memory
        string memory table = _TABLE;

        // Encoding takes 3 bytes chunks of binary data from `bytes` data parameter
        // and split into 4 numbers of 6 bits.
        // The final Base64 length should be `bytes` data length multiplied by 4/3 rounded up
        // - `data.length + 2`  -> Round up
        // - `/ 3`              -> Number of 3-bytes chunks
        // - `4 *`              -> 4 characters for each chunk
        string memory result = new string(4 * ((data.length + 2) / 3));

        /// @solidity memory-safe-assembly
        assembly {
            // Prepare the lookup table (skip the first "length" byte)
            let tablePtr := add(table, 1)

            // Prepare result pointer, jump over length
            let resultPtr := add(result, 32)

            // Run over the input, 3 bytes at a time
            for {
                let dataPtr := data
                let endPtr := add(data, mload(data))
            } lt(dataPtr, endPtr) {

            } {
                // Advance 3 bytes
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)

                // To write each character, shift the 3 bytes (18 bits) chunk
                // 4 times in blocks of 6 bits for each character (18, 12, 6, 0)
                // and apply logical AND with 0x3F which is the number of
                // the previous character in the ASCII table prior to the Base64 Table
                // The result is then added to the table to get the character to write,
                // and finally write it in the result pointer but with a left shift
                // of 256 (1 byte) - 8 (1 ASCII char) = 248 bits

                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1) // Advance

                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1) // Advance

                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                resultPtr := add(resultPtr, 1) // Advance

                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
                resultPtr := add(resultPtr, 1) // Advance
            }

            // When data `bytes` is not exactly 3 bytes long
            // it is padded with `=` characters at the end
            switch mod(mload(data), 3)
            case 1 {
                mstore8(sub(resultPtr, 1), 0x3d)
                mstore8(sub(resultPtr, 2), 0x3d)
            }
            case 2 {
                mstore8(sub(resultPtr, 1), 0x3d)
            }
        }

        return result;
    }
}


// File contracts/CellData.sol

// Original license: SPDX_License_Identifier: MIT

library CellData {
    struct Cell {
        int16 q;
        int16 r;
        uint32 x;
        uint32 y;
        bool isIsland;
    }

    function getInitialCells() external pure returns (Cell[] memory) {
        Cell[] memory cells = new Cell[](169);
        cells[0] = Cell(0, 7, 70932667, 257500000, false);
        cells[1] = Cell(0, 8, 83923048, 280000000, false);
        cells[2] = Cell(0, 9, 96913430, 302500000, false);
        cells[3] = Cell(0, 10, 109903811, 325000000, false);
        cells[4] = Cell(0, 11, 122894192, 347500000, false);
        cells[5] = Cell(0, 12, 135884573, 370000000, false);
        cells[6] = Cell(0, 13, 148874954, 392500000, false);
        cells[7] = Cell(0, 14, 161865335, 415000000, false);
        cells[8] = Cell(1, 6, 83923048, 235000000, false);
        cells[9] = Cell(1, 7, 96913430, 257500000, false);
        cells[10] = Cell(1, 8, 109903811, 280000000, false);
        cells[11] = Cell(1, 9, 122894192, 302500000, false);
        cells[12] = Cell(1, 10, 135884573, 325000000, false);
        cells[13] = Cell(1, 11, 148874954, 347500000, false);
        cells[14] = Cell(1, 12, 161865335, 370000000, false);
        cells[15] = Cell(1, 13, 174855716, 392500000, false);
        cells[16] = Cell(1, 14, 187846097, 415000000, false);
        cells[17] = Cell(2, 5, 96913430, 212500000, false);
        cells[18] = Cell(2, 6, 109903811, 235000000, false);
        cells[19] = Cell(2, 7, 122894192, 257500000, false);
        cells[20] = Cell(2, 8, 135884573, 280000000, false);
        cells[21] = Cell(2, 9, 148874954, 302500000, false);
        cells[22] = Cell(2, 10, 161865335, 325000000, false);
        cells[23] = Cell(2, 11, 174855716, 347500000, false);
        cells[24] = Cell(2, 12, 187846097, 370000000, false);
        cells[25] = Cell(2, 13, 200836478, 392500000, false);
        cells[26] = Cell(2, 14, 213826859, 415000000, false);
        cells[27] = Cell(3, 4, 109903811, 190000000, false);
        cells[28] = Cell(3, 5, 122894192, 212500000, false);
        cells[29] = Cell(3, 6, 135884573, 235000000, false);
        cells[30] = Cell(3, 7, 148874954, 257500000, false);
        cells[31] = Cell(3, 8, 161865335, 280000000, false);
        cells[32] = Cell(3, 9, 174855716, 302500000, false);
        cells[33] = Cell(3, 10, 187846097, 325000000, false);
        cells[34] = Cell(3, 11, 200836478, 347500000, false);
        cells[35] = Cell(3, 12, 213826859, 370000000, false);
        cells[36] = Cell(3, 13, 226817240, 392500000, false);
        cells[37] = Cell(3, 14, 239807621, 415000000, false);
        cells[38] = Cell(4, 3, 122894192, 167500000, false);
        cells[39] = Cell(4, 4, 135884573, 190000000, false);
        cells[40] = Cell(4, 5, 148874954, 212500000, false);
        cells[41] = Cell(4, 6, 161865335, 235000000, false);
        cells[42] = Cell(4, 7, 174855716, 257500000, false);
        cells[43] = Cell(4, 8, 187846097, 280000000, false);
        cells[44] = Cell(4, 9, 200836478, 302500000, false);
        cells[45] = Cell(4, 10, 213826859, 325000000, false);
        cells[46] = Cell(4, 11, 226817240, 347500000, false);
        cells[47] = Cell(4, 12, 239807621, 370000000, false);
        cells[48] = Cell(4, 13, 252798002, 392500000, false);
        cells[49] = Cell(4, 14, 265788383, 415000000, false);
        cells[50] = Cell(5, 2, 135884573, 145000000, false);
        cells[51] = Cell(5, 3, 148874954, 167500000, false);
        cells[52] = Cell(5, 4, 161865335, 190000000, false);
        cells[53] = Cell(5, 5, 174855716, 212500000, false);
        cells[54] = Cell(5, 6, 187846097, 235000000, false);
        cells[55] = Cell(5, 7, 200836478, 257500000, false);
        cells[56] = Cell(5, 8, 213826859, 280000000, false);
        cells[57] = Cell(5, 9, 226817240, 302500000, false);
        cells[58] = Cell(5, 10, 239807621, 325000000, false);
        cells[59] = Cell(5, 11, 252798002, 347500000, false);
        cells[60] = Cell(5, 12, 265788383, 370000000, false);
        cells[61] = Cell(5, 13, 278778764, 392500000, false);
        cells[62] = Cell(5, 14, 291769145, 415000000, false);
        cells[63] = Cell(6, 1, 148874954, 122500000, false);
        cells[64] = Cell(6, 2, 161865335, 145000000, false);
        cells[65] = Cell(6, 3, 174855716, 167500000, false);
        cells[66] = Cell(6, 4, 187846097, 190000000, false);
        cells[67] = Cell(6, 5, 200836478, 212500000, false);
        cells[68] = Cell(6, 6, 213826859, 235000000, false);
        cells[69] = Cell(6, 7, 226817240, 257500000, false);
        cells[70] = Cell(6, 8, 239807621, 280000000, false);
        cells[71] = Cell(6, 9, 252798002, 302500000, false);
        cells[72] = Cell(6, 10, 265788383, 325000000, false);
        cells[73] = Cell(6, 11, 278778764, 347500000, false);
        cells[74] = Cell(6, 12, 291769145, 370000000, false);
        cells[75] = Cell(6, 13, 304759526, 392500000, false);
        cells[76] = Cell(6, 14, 317749907, 415000000, false);
        cells[77] = Cell(7, 0, 161865335, 100000000, false);
        cells[78] = Cell(7, 1, 174855716, 122500000, false);
        cells[79] = Cell(7, 2, 187846097, 145000000, false);
        cells[80] = Cell(7, 3, 200836478, 167500000, false);
        cells[81] = Cell(7, 4, 213826859, 190000000, false);
        cells[82] = Cell(7, 5, 226817240, 212500000, false);
        cells[83] = Cell(7, 6, 239807621, 235000000, false);
        cells[84] = Cell(7, 7, 252798002, 257500000, false);
        cells[85] = Cell(7, 8, 265788383, 280000000, false);
        cells[86] = Cell(7, 9, 278778764, 302500000, false);
        cells[87] = Cell(7, 10, 291769145, 325000000, false);
        cells[88] = Cell(7, 11, 304759526, 347500000, false);
        cells[89] = Cell(7, 12, 317749907, 370000000, false);
        cells[90] = Cell(7, 13, 330740289, 392500000, false);
        cells[91] = Cell(7, 14, 343730670, 415000000, false);
        cells[92] = Cell(8, 0, 187846097, 100000000, false);
        cells[93] = Cell(8, 1, 200836478, 122500000, false);
        cells[94] = Cell(8, 2, 213826859, 145000000, false);
        cells[95] = Cell(8, 3, 226817240, 167500000, false);
        cells[96] = Cell(8, 4, 239807621, 190000000, false);
        cells[97] = Cell(8, 5, 252798002, 212500000, false);
        cells[98] = Cell(8, 6, 265788383, 235000000, false);
        cells[99] = Cell(8, 7, 278778764, 257500000, false);
        cells[100] = Cell(8, 8, 291769145, 280000000, false);
        cells[101] = Cell(8, 9, 304759526, 302500000, false);
        cells[102] = Cell(8, 10, 317749907, 325000000, false);
        cells[103] = Cell(8, 11, 330740289, 347500000, false);
        cells[104] = Cell(8, 12, 343730670, 370000000, false);
        cells[105] = Cell(8, 13, 356721051, 392500000, false);
        cells[106] = Cell(9, 0, 213826859, 100000000, false);
        cells[107] = Cell(9, 1, 226817240, 122500000, false);
        cells[108] = Cell(9, 2, 239807621, 145000000, false);
        cells[109] = Cell(9, 3, 252798002, 167500000, false);
        cells[110] = Cell(9, 4, 265788383, 190000000, false);
        cells[111] = Cell(9, 5, 278778764, 212500000, false);
        cells[112] = Cell(9, 6, 291769145, 235000000, false);
        cells[113] = Cell(9, 7, 304759526, 257500000, false);
        cells[114] = Cell(9, 8, 317749907, 280000000, false);
        cells[115] = Cell(9, 9, 330740289, 302500000, false);
        cells[116] = Cell(9, 10, 343730670, 325000000, false);
        cells[117] = Cell(9, 11, 356721051, 347500000, false);
        cells[118] = Cell(9, 12, 369711432, 370000000, false);
        cells[119] = Cell(10, 0, 239807621, 100000000, false);
        cells[120] = Cell(10, 1, 252798002, 122500000, false);
        cells[121] = Cell(10, 2, 265788383, 145000000, false);
        cells[122] = Cell(10, 3, 278778764, 167500000, false);
        cells[123] = Cell(10, 4, 291769145, 190000000, false);
        cells[124] = Cell(10, 5, 304759526, 212500000, false);
        cells[125] = Cell(10, 6, 317749907, 235000000, false);
        cells[126] = Cell(10, 7, 330740289, 257500000, false);
        cells[127] = Cell(10, 8, 343730670, 280000000, false);
        cells[128] = Cell(10, 9, 356721051, 302500000, false);
        cells[129] = Cell(10, 10, 369711432, 325000000, false);
        cells[130] = Cell(10, 11, 382701813, 347500000, false);
        cells[131] = Cell(11, 0, 265788383, 100000000, false);
        cells[132] = Cell(11, 1, 278778764, 122500000, false);
        cells[133] = Cell(11, 2, 291769145, 145000000, false);
        cells[134] = Cell(11, 3, 304759526, 167500000, false);
        cells[135] = Cell(11, 4, 317749907, 190000000, false);
        cells[136] = Cell(11, 5, 330740289, 212500000, false);
        cells[137] = Cell(11, 6, 343730670, 235000000, false);
        cells[138] = Cell(11, 7, 356721051, 257500000, false);
        cells[139] = Cell(11, 8, 369711432, 280000000, false);
        cells[140] = Cell(11, 9, 382701813, 302500000, false);
        cells[141] = Cell(11, 10, 395692194, 325000000, false);
        cells[142] = Cell(12, 0, 291769145, 100000000, false);
        cells[143] = Cell(12, 1, 304759526, 122500000, false);
        cells[144] = Cell(12, 2, 317749907, 145000000, false);
        cells[145] = Cell(12, 3, 330740289, 167500000, false);
        cells[146] = Cell(12, 4, 343730670, 190000000, false);
        cells[147] = Cell(12, 5, 356721051, 212500000, false);
        cells[148] = Cell(12, 6, 369711432, 235000000, false);
        cells[149] = Cell(12, 7, 382701813, 257500000, false);
        cells[150] = Cell(12, 8, 395692194, 280000000, false);
        cells[151] = Cell(12, 9, 408682575, 302500000, false);
        cells[152] = Cell(13, 0, 317749907, 100000000, false);
        cells[153] = Cell(13, 1, 330740289, 122500000, false);
        cells[154] = Cell(13, 2, 343730670, 145000000, false);
        cells[155] = Cell(13, 3, 356721051, 167500000, false);
        cells[156] = Cell(13, 4, 369711432, 190000000, false);
        cells[157] = Cell(13, 5, 382701813, 212500000, false);
        cells[158] = Cell(13, 6, 395692194, 235000000, false);
        cells[159] = Cell(13, 7, 408682575, 257500000, false);
        cells[160] = Cell(13, 8, 421672956, 280000000, false);
        cells[161] = Cell(14, 0, 343730670, 100000000, false);
        cells[162] = Cell(14, 1, 356721051, 122500000, false);
        cells[163] = Cell(14, 2, 369711432, 145000000, false);
        cells[164] = Cell(14, 3, 382701813, 167500000, false);
        cells[165] = Cell(14, 4, 395692194, 190000000, false);
        cells[166] = Cell(14, 5, 408682575, 212500000, false);
        cells[167] = Cell(14, 6, 421672956, 235000000, false);
        cells[168] = Cell(14, 7, 434663337, 257500000, false);
        return cells;
    }
}


// File contracts/COV.sol

// Original license: SPDX_License_Identifier: MIT
contract COV is ERC721, Ownable {
    using Strings for uint256;
    using Base64 for bytes;

    // Custom error for unauthorized access
    error NotGameContract(address caller);

    // Modifier to restrict function access to the game contract
    modifier onlyGameContract() {
        if (msg.sender != gameContract) {
            revert NotGameContract(msg.sender);
        }
        _;
    }

    address public gameContract;

    mapping(uint256 => uint256) public tokenGameId;
    mapping(uint256 => mapping(uint32 => bool)) private tokenIslands;

    // Mappings to store movement data
    mapping(uint256 => address[]) private tokenPlayers;
    mapping(uint256 => uint8[]) private tokenMovementQs;
    mapping(uint256 => uint8[]) private tokenMovementRs;
    mapping(uint256 => uint256[]) private tokenMovementIndices;

    // Define SVG constants
    string constant svgHeader =
        '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 500 500">';
    string constant svgFooter = "</svg>";
    string constant svgDefs =
        "<defs>"
        '<style type="text/css">'
        ".hexagon { stroke: rgb(215, 114, 127); fill: none; visibility: hidden; }"
        ".island { fill: #B95C6E; }"
        ".background { fill: #202424; visibility: visible; }"
        ".travel { stroke: #A6D3F2; stroke-width: 2px; fill: none; }"
        ".travelMarker { stroke: #A6D3F2; fill: #A6D3F2; visibility: hidden; }"
        ".winner { stroke: #252872; stroke-width: 2px; fill: none; }"
        ".travelMarkerWinner { stroke: #252872; fill: #252872; visibility: hidden; }"
        "</style>"
        '<polygon id="hexagon" points="0,-15 12.99,-7.5 12.99,7.5 0,15 -12.99,7.5 -12.99,-7.5" />'
        '<rect id="island" x="-7.5" y="-7.5" width="15" height="15" />'
        '<marker id="shipStart" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="0">'
        '<rect x="2.5" y="2.5" width="5" height="5" class="travelMarker" />'
        "</marker>"
        '<marker id="shipEnd" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="auto">'
        '<path d="M 2.5,2.5 L 7.5,7.5 M 7.5,2.5 L 2.5,7.5" class="travelMarker" />'
        "</marker>"
        '<marker id="shipStartWinner" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="0">'
        '<rect x="2.5" y="2.5" width="5" height="5" class="travelMarkerWinner" />'
        "</marker>"
        '<marker id="shipEndWinner" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="auto">'
        '<path d="M 2.5,2.5 L 7.5,7.5 M 7.5,2.5 L 2.5,7.5" class="travelMarkerWinner" />'
        "</marker>"
        "</defs>";
    string constant background =
        '<rect x="0" y="0" width="100%" height="100%" class="background" />';

    constructor(
        address initialOwner
    ) ERC721("COV", "COV") Ownable(initialOwner) {}

    // Function to set the game contract address
    function setGameContract(address _gameContract) external onlyOwner {
        gameContract = _gameContract;
    }

    // Function to get a unique cell ID based on q and r coordinates
    function getCellId(int16 q, int16 r) public pure returns (uint32) {
        return (uint32(uint16(q)) << 16) | uint16(r);
    }

    // Function to convert scaled integers to strings
    function scaledIntToString(
        uint32 value
    ) internal pure returns (string memory) {
        // Convert scaled integer to string with up to 6 decimal places
        uint256 integerPart = uint256(value) / 1e6;
        uint256 fractionalPart = uint256(value) % 1e6;

        if (fractionalPart == 0) {
            return integerPart.toString();
        }

        // Remove trailing zeros from fractional part
        while (fractionalPart % 10 == 0) {
            fractionalPart /= 10;
        }

        return
            string(
                abi.encodePacked(
                    integerPart.toString(),
                    ".",
                    fractionalPart.toString()
                )
            );
    }

    // Function to generate the SVG for a given tokenId
    function generateSVG(
        uint256 tokenId
    ) internal view returns (string memory) {
        string memory hexagonsGroup = '<g id="hexagons">';
        CellData.Cell[] memory cells = CellData.getInitialCells();

        // Generate hexagon and island elements
        for (uint256 i = 0; i < cells.length; i++) {
            CellData.Cell memory cell = cells[i];

            // Convert scaled integer coordinates to string
            string memory x = scaledIntToString(cell.x);
            string memory y = scaledIntToString(cell.y);

            // Generate the <use> element for the hexagon
            hexagonsGroup = string(
                abi.encodePacked(
                    hexagonsGroup,
                    '<use href="#hexagon" class="hexagon" x="',
                    x,
                    '" y="',
                    y,
                    '" />'
                )
            );

            uint32 cellId = getCellId(cell.q, cell.r);

            // If the cell is an island for this token, add the island SVG element
            if (tokenIslands[tokenId][cellId]) {
                hexagonsGroup = string(
                    abi.encodePacked(
                        hexagonsGroup,
                        '<use href="#island" class="island" x="',
                        x,
                        '" y="',
                        y,
                        '" />'
                    )
                );
            }
        }
        hexagonsGroup = string(abi.encodePacked(hexagonsGroup, "</g>"));

        // Generate travelsGroup dynamically
        string memory travelsGroup = '<g id="travels">';

        // Retrieve movement data for the tokenId
        address[] storage players = tokenPlayers[tokenId];
        uint8[] storage qs = tokenMovementQs[tokenId];
        uint8[] storage rs = tokenMovementRs[tokenId];
        uint256[] storage indices = tokenMovementIndices[tokenId];

        for (uint256 i = 0; i < players.length; i++) {
            uint256 startIndex = indices[i];
            uint256 endIndex = indices[i + 1];

            // Build the path data
            string memory pathData = "M ";

            for (uint256 j = startIndex; j < endIndex; j++) {
                uint8 q = qs[j];
                uint8 r = rs[j];

                // Convert q, r to x, y using getXYFromQR function
                (uint32 xCoord, uint32 yCoord) = getXYFromQR(q, r, cells);

                // Append the point to the path data
                pathData = string(
                    abi.encodePacked(
                        pathData,
                        scaledIntToString(xCoord),
                        " ",
                        scaledIntToString(yCoord),
                        (j < endIndex - 1) ? " L " : ""
                    )
                );
            }

            // Create the path element
            travelsGroup = string(
                abi.encodePacked(
                    travelsGroup,
                    '<path d="',
                    pathData,
                    '" class="travel" marker-start="url(#shipStart)" marker-end="url(#shipEnd)" />'
                )
            );
        }

        travelsGroup = string(abi.encodePacked(travelsGroup, "</g>"));

        // Generate winnersGroup dynamically
        string memory winnersGroup = '<g id="winners">';

        // Retrieve winner's movement data
        uint256 winnerStartIndex = indices[indices.length - 1]; // Last set of movements
        uint8[] memory winnerQs = tokenMovementQs[tokenId];
        uint8[] memory winnerRs = tokenMovementRs[tokenId];

        // Build the path data for the winner
        string memory winnerPathData = "M ";

        for (uint256 j = winnerStartIndex; j < winnerQs.length; j++) {
            // Convert q, r to x, y using getXYFromQR function
            (uint32 xCoord, uint32 yCoord) = getXYFromQR(
                winnerQs[j],
                winnerRs[j],
                cells
            );

            // Append the point to the path data
            winnerPathData = string(
                abi.encodePacked(
                    winnerPathData,
                    scaledIntToString(xCoord),
                    " ",
                    scaledIntToString(yCoord),
                    (j < winnerQs.length - 1) ? " L " : ""
                )
            );
        }

        // Create the path element for the winner
        winnersGroup = string(
            abi.encodePacked(
                winnersGroup,
                '<path d="',
                winnerPathData,
                '" class="winner" marker-start="url(#shipStartWinner)" marker-end="url(#shipEndWinner)" />'
            )
        );

        winnersGroup = string(abi.encodePacked(winnersGroup, "</g>"));

        // Assemble the SVG
        return
            string(
                abi.encodePacked(
                    svgHeader,
                    svgDefs,
                    background,
                    hexagonsGroup,
                    travelsGroup,
                    winnersGroup,
                    svgFooter
                )
            );
    }

    // Function to map q and r coordinates to x and y pixel coordinates
    function getXYFromQR(
        uint8 q,
        uint8 r,
        CellData.Cell[] memory cells
    ) internal pure returns (uint32 x, uint32 y) {
        // Convert uint8 q and r to int16 safely
        int16 qInt = int16(uint16(q));
        int16 rInt = int16(uint16(r));

        for (uint256 i = 0; i < cells.length; i++) {
            if (cells[i].q == qInt && cells[i].r == rInt) {
                return (cells[i].x, cells[i].y);
            }
        }
        revert("Cell not found");
    }

    // Override tokenURI function to generate token metadata
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // ownerOf will revert if token does not exist
        address owner = ownerOf(tokenId);

        string memory svg = generateSVG(tokenId);
        string memory image = string(
            abi.encodePacked("data:image/svg+xml;base64,", bytes(svg).encode())
        );

        string memory json = string(
            abi.encodePacked(
                '{"name": "COV #',
                tokenId.toString(),
                '", "description": "COV", "gameId": "',
                tokenGameId[tokenId].toString(),
                '", "image": "',
                image,
                '"}'
            )
        );

        string memory encodedJson = bytes(json).encode();

        return
            string(
                abi.encodePacked("data:application/json;base64,", encodedJson)
            );
    }

    // Mint function to create a new token with associated data
    function mint(
        address to,
        uint256 tokenId,
        uint256 gameId,
        int16[] calldata islandsQ,
        int16[] calldata islandsR,
        address[] calldata playersInput,
        uint8[] calldata qsInput,
        uint8[] calldata rsInput,
        uint256[] calldata indicesInput,
        uint8[] calldata winnerQs,
        uint8[] calldata winnerRs
    ) external onlyGameContract {
        require(
            islandsQ.length == islandsR.length,
            "Input arrays must have the same length"
        );
        require(
            qsInput.length == rsInput.length,
            "Movement arrays must have the same length"
        );
        require(
            indicesInput.length == playersInput.length + 1,
            "Invalid indices length"
        );
        _safeMint(to, tokenId);
        tokenGameId[tokenId] = gameId;

        // Store islands data
        for (uint256 i = 0; i < islandsQ.length; i++) {
            uint32 cellId = getCellId(islandsQ[i], islandsR[i]);
            tokenIslands[tokenId][cellId] = true;
        }

        // Store movement data
        // Store players
        for (uint256 i = 0; i < playersInput.length; i++) {
            tokenPlayers[tokenId].push(playersInput[i]);
        }

        // Store qs
        for (uint256 i = 0; i < qsInput.length; i++) {
            tokenMovementQs[tokenId].push(qsInput[i]);
        }

        // Store rs
        for (uint256 i = 0; i < rsInput.length; i++) {
            tokenMovementRs[tokenId].push(rsInput[i]);
        }

        // Store indices
        for (uint256 i = 0; i < indicesInput.length; i++) {
            tokenMovementIndices[tokenId].push(indicesInput[i]);
        }

        // Store winner data
        for (uint256 i = 0; i < winnerQs.length; i++) {
            tokenMovementQs[tokenId].push(winnerQs[i]);
            tokenMovementRs[tokenId].push(winnerRs[i]);
        }
    }

    function getIslands(
        uint256 tokenId
    ) external view returns (uint32[] memory) {
        uint256 count;
        CellData.Cell[] memory cells = CellData.getInitialCells();
        for (uint256 i = 0; i < cells.length; i++) {
            uint32 cellId = getCellId(cells[i].q, cells[i].r);
            if (tokenIslands[tokenId][cellId]) {
                count++;
            }
        }

        uint32[] memory islands = new uint32[](count);
        uint256 index;
        for (uint256 i = 0; i < cells.length; i++) {
            uint32 cellId = getCellId(cells[i].q, cells[i].r);
            if (tokenIslands[tokenId][cellId]) {
                islands[index++] = cellId;
            }
        }
        return islands;
    }

    function getPlayers(
        uint256 tokenId
    ) external view returns (address[] memory) {
        return tokenPlayers[tokenId];
    }

    function getMovements(
        uint256 tokenId
    )
        external
        view
        returns (uint8[] memory qs, uint8[] memory rs, uint256[] memory indices)
    {
        return (
            tokenMovementQs[tokenId],
            tokenMovementRs[tokenId],
            tokenMovementIndices[tokenId]
        );
    }
}
